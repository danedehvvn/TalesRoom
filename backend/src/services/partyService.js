const partyRepository = require('../repositories/partyRepository');

function httpError(status, message) {
    const err = new Error(message);
    err.status = status;
    return err;
}

// 파티 멤버 확인
function isMember(party, userId) {
    if (party.userId === userId) return true;
    return (party.applications || []).some((a) => a.userId === userId);
}

// 번호, 파티, 멤버 확인
function checkParty(party, user) {
    if (!party || party.status !== 'CLOSED') throw httpError(404, '파티를 찾을 수 없습니다.');
    if (!isMember(party, user.id)) throw httpError(403, '파티 멤버만 볼 수 있습니다.');
}

function checkId(id) {
    if (!Number.isInteger(id) || id < 1) throw httpError(400, '잘못된 번호입니다.');
}

// 내 파티 목록
async function getMyParties(user) {
    const rows = await partyRepository.findMyParties(user.id);
    return rows.map((r) => {
        const p = r.get({ plain: true });
        return {
            id: p.id,
            title: p.title,
            meetDate: p.meetDate,
            memberCount: Number(p.approvedCount) + 1,
            capacity: p.capacity,
            author: p.author,
            isLeader: p.author?.userId === user.id,
    }});
}

// 파티 상세
async function getPartyDetail(id, user) {
    checkId(id);
    const party = await partyRepository.findPartyWithDetails(id);
    checkParty(party, user);
    const p = party.get({ plain: true });

    return {
        id: p.id,
        title: p.title,
        content: p.content,
        meetDate: p.meetDate,
        theme: p.theme,
        author: p.author,
        members: [p.author, ...p.applications.map((a) => a.applicant)],
        isLeader: p.userId === user.id,
        comments: (p.partyComments || []).map((c) => ({
            id: c.id,
            content: c.content,
            author: c.author,
            createdAt: c.createdAt,
        })),
    };
}

// 파티 대화 쓰기
async function addComment(id, user, body) {
    checkId(id);
    const { content } = body || {};
    if (!content || !content.trim()) throw httpError(400, '내용을 입력해 주세요.');

    const party = await partyRepository.findPartyMembers(id);
    checkParty(party, user);

    const comment = await partyRepository.createComment({
        recruitmentId: id,
        userId: user.id,
        content: content.trim(),
    });
    return { id: comment.id };
}

module.exports = { getMyParties, getPartyDetail, addComment };