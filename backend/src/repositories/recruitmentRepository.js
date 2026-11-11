const { Op } = require('sequelize');
const { Recruitment, User, Theme, RecruitmentApplication, sequelize } = require('../models');

// 모집글 1개 + 작성자 + 테마 + 신청 댓글
async function findByIdWithDetails(id) {
    return Recruitment.findByPk(id, {
        include: [
            { model: User, as: 'author', attributes: [['id', 'userId'], 'nickname'] },
            { model: Theme, as: 'theme', attributes: ['id', 'title', 'storeName'] },
            {
                model: RecruitmentApplication, as: 'applications',
                attributes: ['id', 'userId', 'content', 'status', 'createdAt'],
                include: [{ model: User, as: 'applicant', attributes: [['id', 'userId'], 'nickname'] }],
            },
        ],
        order: [[{ model: RecruitmentApplication, as: 'applications' }, 'createdAt', 'ASC']],
    });
}

// 모집글 저장
async function create(data) {
    return Recruitment.create(data);
}

// 모집 목록
async function findPage({ limit, offset }) {
    return Recruitment.findAndCountAll({
        where: { status: { [Op.in]: ['OPEN', 'CANCELED' ] } },
        attributes: [
            'id', 'title', 'themeName', 'meetDate', 'capacity', 'status', 'createdAt' ,   // themeName = 직접 쓴 테마 이름
            [
                sequelize.literal(`(
                    SELECT COUNT(*) FROM recruitment_applications As ra
                    WHERE ra.recruitment_id = Recruitment.id
                    AND ra.status = 'APPROVED'
                    )`),
                    'approvedCount',
            ],
        ],
        include: [
            { model: User, as: 'author', attributes: [['id', 'userId'], 'nickname'] },
            { model: Theme, as: 'theme', attributes: ['id', 'title', 'storeName'] },   // 테마 찾기로 고른 테마 (없으면 null, LEFT JOIN)
        ],
        order: [['createdAt', 'DESC'], ['id', 'DESC']],   // 최신순, 같은 초에 쓴 글은 번호 큰 순 (순서가 매번 같게)
        limit,
        offset,
    });
}

// 모집글 1개
async function findById(id) {
    return Recruitment.findByPk(id);
}

// 테마 확인
async function findThemeById(id) {
    return Theme.findByPk(id, { attributes: ['id'] });
}

// 특정 회원이 특정 글에 신청(중복 방지)
async function findApplication(recruitmentId, userId) {
    return RecruitmentApplication.findOne({ where: { recruitmentId, userId } });
}

// 인원 확인
async function countApproved(recruitmentId) {
    return RecruitmentApplication.count({ where: { recruitmentId, status: 'APPROVED' } });
}

// 신청 댓글 저장
async function createApplication(data) {
    return RecruitmentApplication.create(data);
}

// 신청 승인, 거절
async function findApplicationById(id) {
    return RecruitmentApplication.findByPk(id);
}
async function updateApplicationStatus(application,status) {
    return application.update({ status });
}

// 승인되지 않은것 일괄 삭제
async function deleteUnapproved(recruitmentId, transaction) {
    return RecruitmentApplication.destroy({
        where: { recruitmentId, status: { [Op.ne]: 'APPROVED' } },
        transaction,
    });
}

// 모집글 상태변경
async function updateStatus(recruitment, status, transaction) {
    return recruitment.update({ status }, { transaction } );
}

module.exports = { create, findPage, findByIdWithDetails, findById, findApplication, countApproved, createApplication, findApplicationById, updateApplicationStatus, deleteUnapproved, updateStatus, findThemeById };