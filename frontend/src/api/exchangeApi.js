import api from './axiosInstance'; 

// 1. 상품 목록 조회 (퍼블릭)
export async function fetchItems() {
    const response = await api.get('/exchange');
    return response.data.data;
}

// 2. 상품 교환 신청 (인증 필요 - 인터셉터가 토큰 자동 첨부)
export async function exchangeItem(itemId, quantity = 1) {
    const response = await api.post('/exchange', { itemId, quantity });
    return response.data.data;
}

// 3. 내 교환 내역 조회 (인증 필요)
export async function fetchMyExchanges() {
    const response = await api.get('/exchange/me');
    return response.data.data;
}

// --- [관리자 전용 API] ---

// 4. 전체 유저 교환 내역
export async function fetchAllExchanges() {
    const response = await api.get('/exchange/admin/history');
    return response.data.data;
}

// 5. 상품 등록 (관리자용) -> 최종 요청 주소: /api/exchange/items
export async function createItem(itemData) {
    const response = await api.post('/exchange/items', itemData);
    return response.data.data;
}

// 6. 상품 수정 (관리자용) -> 최종 요청 주소: /api/exchange/items/:itemId
export async function updateItem(itemId, itemData) {
    const response = await api.put(`/exchange/items/${itemId}`, itemData);
    return response.data.data;
}

// 7. 상품 삭제 (관리자용) -> 최종 요청 주소: /api/exchange/items/:itemId
export async function deleteItem(itemId) {
    const response = await api.delete(`/exchange/items/${itemId}`);
    return response.data.data;
}