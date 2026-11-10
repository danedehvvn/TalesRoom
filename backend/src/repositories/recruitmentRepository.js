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
            'id', 'title', 'meetDate', 'capacity', 'status', 'createdAt' ,
            [
                sequelize.literal(`(
                    SELECT COUNT(*) FROM recruitment_applications As ra
                    WHERE ra.recruitment_id = Recruitment.id
                    AND ra.status = 'APPROVED'
                    )`),
                    'approvedCount',
            ],
        ],
        include: [{ model: User, as: 'author', attributes: [['id', 'userId'], 'nickname'] }],
        order: [['createdAt', 'DESC']],
        limit,
        offset,
    });
}

// 모집글 1개
async function findById(id) {
    return Recruitment.findByPk(id);
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

module.exports = { create, findPage, findByIdWithDetails, findById, findApplication, countApproved, createApplication };