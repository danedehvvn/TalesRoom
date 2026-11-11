const { Op } = require('sequelize');
const { Recruitment, RecruitmentApplication, PartyComment, User, Theme, sequelize } = require('../models');

// 내 파티 목록
async function findMyParties(userId) {
    const me = sequelize.escape(userId);
    return Recruitment.findAll({
        where: {
            status: 'CLOSED',
            [Op.or]: [
                { userId },
                sequelize.literal(`EXISTS (
                    SELECT 1 FROM recruitment_applications As ra
                    WHERE ra.recruitment_id = Recruitment.id
                    AND ra.user_id = ${me}
                    AND ra.status = 'APPROVED'
                    )`),
            ],
        },
        attributes: [
            'id', 'title', 'meetDate', 'capacity',
            [
                sequelize.literal(`(
                    SELECT COUNT(*) FROM recruitment_applications As ra
                    WHERE ra.recruitment_id = Recruitment.id AND ra.status = 'APPROVED'
                )`),
                'approvedCount',
            ],
        ],
        include: [{ model: User, as: 'author', attributes: [['id', 'userId'], 'nickname']}],
        order: [['meetDate', 'ASC']],
    });
}

// 파티 상세: 본문+작성자+테마+멤버+대화
async function findPartyWithDetails(id) {
    return Recruitment.findByPk(id, {
        include: [
            { model: User, as: 'author', attributes: [['id', 'userId'], 'nickname']},
            { model: Theme, as: 'theme', attributes: ['id', 'title', 'storeName'] },
            {
                model: RecruitmentApplication, as: 'applications',
                where: { status: 'APPROVED' },
                required: false,
                attributes: ['userId'],
                include: [{ model: User, as: 'applicant', attributes: [['id', 'userId'], 'nickname'] }],
            },
            {
                model: PartyComment, as: 'partyComments',
                attributes: ['id', 'content', 'createdAt'],
                include: [{ model: User, as: 'author', attributes: [['id', 'userId'], 'nickname']}],
            },
        ],
        order: [[{ model: PartyComment, as: 'partyComments'}, 'createdAt', 'ASC']],
    });
}

// 확인용

async function findPartyMembers(id) {
    return Recruitment.findByPk(id, {
        attributes: ['id', 'userId', 'status'],
        include: [{ model: RecruitmentApplication, as: 'applications', where: { status: 'APPROVED' }, required: false, attributes: ['userId'] }],
    });
}

// 대화(댓글) 저장
async function createComment(data) {
    return PartyComment.create(data);
}

module.exports = { findMyParties, findPartyWithDetails, findPartyMembers, createComment };