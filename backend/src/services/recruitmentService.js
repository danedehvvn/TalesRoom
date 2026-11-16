const recruitmentRepository = require('../repositories/recruitmentRepository');
const { sequelize } = require('../models');    

// 에러메세지
function httpError(status, message) {
    const err = new Error(message);
    err.status = status;
    return err;
}

const MIN_CAPACITY = 2;
const MAX_CAPACITY = 10;

// 모집글 작성
async function createRecruitment(user, body) {
    const { themeId, themeName, title, content, meetDate, capacity } = body || {};

    // 필수값
    if (!title || !title.trim()) throw httpError(400, '제목을 입력해 주세요.');
    if (!content || !content.trim()) throw httpError(400, '내용을 입력해 주세요.');

    // 테마
    const hasThemeId = themeId !== undefined && themeId !== null && themeId !== '';
    const name = typeof themeName === 'string' ? themeName.trim() : '';
    if (hasThemeId && name) throw httpError(400, '테마는 찾기 또는 직접 쓰기 중 하나만 선택해 주세요.'); // 둘 다 보내면 어느 쪽인지 모호하니 막기
    if (name.length > 150) throw httpError(400, '테마 이름은 150자 이하로 입력해 주세요.');
    if (hasThemeId) {
        const tid = Number(themeId);
        if (!Number.isInteger(tid) || tid < 1) throw httpError(400, '잘못된 테마 번호입니다.');
        const theme = await recruitmentRepository.findThemeById(tid);
        if (!theme) throw httpError(400, '존재하지 않는 테마입니다.');
    }

    // 날짜(미래)
    const date = new Date(meetDate);
    if (!meetDate || Number.isNaN(date.getTime())) throw httpError(400, '날짜를 정확히 입력해주세요.');
    if (date <= new Date()) throw httpError(400, '모집 날짜는 현재보다 미래여야 합니다.');

    // 인원 2~10
    const cap = Number(capacity);
    if (!Number.isInteger(cap) || cap < MIN_CAPACITY || cap > MAX_CAPACITY) {
        throw httpError(400, `인원은 ${MIN_CAPACITY}~${MAX_CAPACITY}명 사이로 입력해 주세요.`)
    }

    // 저장
    const recruitment = await recruitmentRepository.create({
        userId: user.id,
        themeId: hasThemeId ? Number(themeId) : null,
        themeName: name || null,
        title: title.trim(),
        content: content.trim(),
        meetDate: date,
        capacity: cap,
    });

    return { id: recruitment.id };
}

// 모집 목록
async function getRecruitments(query) {
    const page = Math.max(parseInt(query.page, 10) || 1, 1);
    const size = Math.min(Math.max(parseInt(query.size, 10) || 10, 1), 50);
    const offset = (page - 1) * size;

    const result = await recruitmentRepository.findPage({ limit: size, offset });

    return {
        items: result.rows.map((r) => {
            const p = r.get({ plain:true });
            return {
                id: p.id,
                title: p.title,
                meetDate: p.meetDate,
                capacity: p.capacity,
                currentCount: Number(p.approvedCount) + 1,
                status: p.status,
                author: p.author,
                theme: p.theme,                 // 고른 테마 { id, title, storeName } 또는 null
                themeName: p.themeName,         // 직접 쓴 테마 이름 또는 null
                createdAt: p.createdAt,
            };
        }),
        page,
        size,
        totalCount: result.count,
        totalPages: Math.ceil(result.count / size),
    };
}

// 모집 상세
async function getRecruitmentDetail(id, user) {

    if (!Number.isInteger(id) || id < 1) throw httpError(400, '잘못된 모집글 번호입니다.');

    const recruitment = await recruitmentRepository.findByIdWithDetails(id);
    if (!recruitment) throw httpError(404, '모집글을 찾을 수 없습니다.');
    const r = recruitment.get({ plain: true });

    if (r.status === 'CLOSED') throw httpError(404, '해당 파티는 마감되었습니다.');

    const applications = r.applications || [];
    const approvedCount = applications.filter((a) => a.status === 'APPROVED').length;
    const mine = user ? applications.find((a) => a.userId === user.id) : null;

    return {
        id: r.id,
        title: r.title,
        themeName: r.themeName,
        content: r.content,
        meetDate: r.meetDate,
        capacity: r.capacity,
        currentCount: approvedCount + 1,
        status: r.status,
        theme: r.theme,
        author: r.author,
        isMine: user ? r.userId === user.id : false,
        myApplicationStatus: mine ? mine.status : null,
        applications: applications.map((a) => ({
            id: a.id,
            content: a.content,
            status: a.status,
            applicant: a.applicant,
            createdAt: a.createdAt,
        })),
        createdAt: r.createdAt,
    }
}

// 신청 댓글 달기
async function applyRecruitment(id, user, body) {
    if (!Number.isInteger(id) || id< 1) throw httpError(400,'잘못된 번호입니다.');
    const { content } = body || {};
    if (!content || !content.trim()) throw httpError(400, '내용을 확인해주세요.');

    const recruitment = await recruitmentRepository.findById(id);
    if (!recruitment) throw httpError(404, '모집글을 찾을 수 없습니다.');

    if(recruitment.status === 'CANCELED') throw httpError(400, '취소된 모집글입니다.');
    if(recruitment.status !== 'OPEN') throw httpError(400, '마감된 모집글입니다.');

    if(recruitment.userId === user.id) throw httpError(400, '본인 모집글은 신청할 수 없습니다.');

    const existing = await recruitmentRepository.findApplication(id, user.id);
    if (existing) throw httpError(400, '이미 신청하였습니다.');

    const approvedCount = await recruitmentRepository.countApproved(id);
    if (approvedCount + 1 >= recruitment.capacity) throw httpError(400, '모집 인원이 다 찼습니다.');

    const application = await recruitmentRepository.createApplication({
        recruitmentId: id,
        userId: user.id,
        content: content.trim(),
    });
    return { id: application.id, status: application.status };
}

// 승인, 거절
const DECISIONS= ['APPROVED', 'REJECTED'];
async function decideApplication(id, applicationId, user, body) {
    if (!Number.isInteger(id) || id < 1) throw httpError(400, '잘못된 번호입니다.');
    if (!Number.isInteger(applicationId) || applicationId < 1) throw httpError(400, '잘못된 번호입니다.');
    const { status } = body || {};
    if (!DECISIONS.includes(status)) throw httpError(400, '승인 또는 거절만 가능합니다.');

    // 모집글 확인
    const recruitment = await recruitmentRepository.findById(id);
    if (!recruitment) throw httpError(404, '글을 찾을 수 없습니다.');
    if (recruitment.userId !== user.id) throw httpError(403, '작성자만 승인/거절할 수 있습니다.');
    if (recruitment.status !== 'OPEN') throw httpError(400, '모집 중인 글만 승인/거절할 수 있습니다.');
    // 신청 확인
    const application = await recruitmentRepository.findApplicationById(applicationId);
    if (!application || application.recruitmentId !== id) throw httpError(404, '신청을 찾을 수 없습니다.');
    if (application.status !== 'PENDING') throw httpError(400, '이미 처리된 신청입니다.');
    // 승인일 때만 인원 확인
    let approvedCount = await recruitmentRepository.countApproved(id);
    if (status === 'APPROVED') {
        if (approvedCount + 1 >= recruitment.capacity) throw httpError(400, '모집 인원이 다 찼습니다.');
        approvedCount += 1;
    }

    await recruitmentRepository.updateApplicationStatus(application, status);
    return {
        id: application.id,
        status,
        currentCount: approvedCount + 1,
        capacity: recruitment.capacity,
        isFull: approvedCount + 1 >= recruitment.capacity,
    };
}

// 작성자 OPEN 확인
async function findOpenRecruitmentOfAuthor(id, user) {
    if (!Number.isInteger(id) || id < 1) throw httpError(400, '잘못된 번호입니다.');
    const recruitment = await recruitmentRepository.findById(id);
    if (!recruitment) throw httpError(404, '모집글을 찾을 수 없습니다.');
    if (recruitment.userId !== user.id) throw httpError(403, '작성자만 가능합니다.');
    if (recruitment.status !== 'OPEN') throw httpError(400, '모집 중인 글이 아닙니다.');
    return recruitment;
}

// 마감 -> 파티 이동
async function closeRecruitment(id, user) {
    const recruitment = await findOpenRecruitmentOfAuthor(id, user);

    const approvedCount = await recruitmentRepository.countApproved(id);
    if (approvedCount + 1 < recruitment.capacity) {
        throw httpError(400, `인원이 부족합니다.`);
    }
    await sequelize.transaction(async (t) => {
        await recruitmentRepository.deleteUnapproved(id, t);
        await recruitmentRepository.updateStatus(recruitment, 'CLOSED', t);
    });

    return { id, status: 'CLOSED' };
}

// 모집 취소
async function cancelRecruitment(id, user) {
    const recruitment = await findOpenRecruitmentOfAuthor(id, user);
    await recruitmentRepository.updateStatus(recruitment, 'CANCELED');
    return { id, status: 'CANCELED' };
}

module.exports = { createRecruitment, getRecruitments, getRecruitmentDetail, applyRecruitment, decideApplication, closeRecruitment, cancelRecruitment };