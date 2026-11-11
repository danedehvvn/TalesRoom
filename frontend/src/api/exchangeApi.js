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