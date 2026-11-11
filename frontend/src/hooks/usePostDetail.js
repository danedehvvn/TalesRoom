import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPostDetail } from '../api/postApi';
import useDialog from './useDialog';

export function usePostDetail(id) {
    const navigate = useNavigate();
    const { showAlert } = useDialog();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showSpoilerModal, setShowSpoilerModal] = useState(false); // 스포일러 경고 팝업 상태
    const [isSpoilerConfirmed, setIsSpoilerConfirmed] = useState(false); // 스포일러 열람 동의 상태

    useEffect(() => {
        let active = true;
        const fetchPostDetail = async () => {
            try {
                setLoading(true);
                // 상세 데이터 조회 
                const postData = await getPostDetail(id);
                if (!active) return;

                // 백엔드에서 받아온 응답 데이터를 그대로 상태에 반영
                setPost(postData);

                // 스포일러가 포함된 글인 경우 진입 시 모달 팝업 및 블러 처리
                if (postData.isSpoiler) {
                    setShowSpoilerModal(true);
                    setIsSpoilerConfirmed(false);
                } else {
                    setIsSpoilerConfirmed(true); // 일반 글은 바로 열람 허용
                }
            } catch (err) {
                if (!active) return;
                console.error('게시글 상세 조회 실패:', err);
                await showAlert('게시글을 불러오지 못했습니다.');
                if (active) navigate(-1);
            } finally {
                if (active) setLoading(false);
            }
        };

        fetchPostDetail();
        return () => { active = false; };
    }, [id, navigate, showAlert]);

    // 모달에서 '열람'을 선택한 경우
    const handleSpoilerConfirm = () => {
        setShowSpoilerModal(false);
        setIsSpoilerConfirmed(true); // 블러 해제 및 내용 노출
    };

    // 모달에서 '돌아가기'를 선택한 경우
    const handleSpoilerCancel = () => {
        navigate(-1);
    };

    return {
        post,
        loading,
        showSpoilerModal,
        isSpoilerConfirmed,
        handleSpoilerConfirm,
        handleSpoilerCancel,
        navigate,
    };
}
