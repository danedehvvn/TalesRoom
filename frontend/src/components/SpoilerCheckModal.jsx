// import React from 'react';
import '../styles/SpoilerModel.css';

function SpoilerCheckModal({ isOpen, onConfirm, onCancel }) {
    if (!isOpen) return null;

    return (
        <div className="spoiler-modal-overlay">
            <div className="spoiler-modal-box">
                <h3>⚠️ 스포일러 주의 경고</h3>
                <p>이 게시글에는 방탈출 테마에 대한 <strong>스포일러(문제 풀이 및 힌트 등)</strong>가 포함되어 있습니다.</p>
                <p>정말 내용을 확인하시겠습니까?</p>

                <div className="spoiler-modal-buttons">
                    <button onClick={onConfirm} className="btn-danger">네, 열람하겠습니다</button>
                    <button onClick={onCancel} className="btn-secondary">아니요, 돌아갈래요</button>
                </div>
            </div>
        </div>
    );
}

export default SpoilerCheckModal;