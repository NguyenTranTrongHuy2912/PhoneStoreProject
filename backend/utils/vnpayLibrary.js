/**
 * VNPay Library - Node.js
 * Viết theo đúng spec official VNPay demo tại:
 * https://sandbox.vnpayment.vn/apis/vnpay-demo/
 * 
 * Key insight: Values phải được encodeURIComponent (spaces→+) TRƯỚC khi ký
 */
const crypto = require('crypto');

class VnPayLibrary {
    constructor() {
        this._requestData = {};
        this._responseData = {};
    }

    addRequestData(key, value) {
        if (value !== null && value !== undefined && value !== '') {
            this._requestData[key] = String(value);
        }
    }

    addResponseData(key, value) {
        if (value !== null && value !== undefined && value !== '') {
            this._responseData[key] = String(value);
        }
    }

    getResponseData(key) {
        return this._responseData[key] || '';
    }

    /**
     * Sort object theo key (encode key để sort đúng ordinal),
     * đồng thời encode VALUE theo chuẩn VNPay (encodeURIComponent + %20→+)
     * 
     * Đây là bản dịch chính xác từ sortObject() trong official VNPay demo Node.js
     */
    static sortObject(obj) {
        const sorted = {};
        // Encode keys để sort theo đúng thứ tự URL-encoded
        const encodedKeys = Object.keys(obj).map(k => encodeURIComponent(k));
        encodedKeys.sort();

        for (const encodedKey of encodedKeys) {
            const originalKey = decodeURIComponent(encodedKey);
            const val = obj[originalKey];
            if (val !== null && val !== undefined && val !== '') {
                // Encode value: encodeURIComponent rồi đổi %20 → +
                sorted[originalKey] = encodeURIComponent(val).replace(/%20/g, '+');
            }
        }
        return sorted;
    }

    /**
     * Tạo URL thanh toán VNPay với chữ ký HMAC-SHA512
     * 
     * Theo đúng official demo:
     *   signData = qs.stringify(sortedParams, { encode: false })
     *   vnpUrl += '?' + qs.stringify({...sortedParams, vnp_SecureHash: signed}, { encode: false })
     */
    createRequestUrl(baseUrl, hashSecret) {
        // 1. Sort và encode params theo chuẩn VNPay
        const sortedParams = VnPayLibrary.sortObject(this._requestData);

        // 2. Tạo chuỗi ký: key=encodedValue&key=encodedValue (KHÔNG encode thêm)
        const signData = Object.entries(sortedParams)
            .map(([k, v]) => `${k}=${v}`)
            .join('&');

        // 3. Tính HMAC-SHA512
        const hmac = crypto.createHmac('sha512', hashSecret);
        const signature = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

        // 4. Build URL cuối (cộng thêm hash, không encode lại)
        return `${baseUrl}?${signData}&vnp_SecureHash=${signature}`;
    }

    /**
     * Xác thực chữ ký từ VNPay callback
     * 
     * Khi Express parse query params, nó đã URL-decode các values.
     * Ta phải re-encode lại (giống sortObject) trước khi tính HMAC để so khớp.
     */
    validateSignature(inputHash, secretKey) {
        const dataToCheck = { ...this._responseData };
        // Xóa các key không dùng để tính checksum
        delete dataToCheck['vnp_SecureHashType'];
        delete dataToCheck['vnp_SecureHash'];

        // Re-encode theo đúng cách VNPay tính hash phía họ
        const sortedParams = VnPayLibrary.sortObject(dataToCheck);

        const signData = Object.entries(sortedParams)
            .map(([k, v]) => `${k}=${v}`)
            .join('&');

        const hmac = crypto.createHmac('sha512', secretKey);
        const myChecksum = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

        return myChecksum.toLowerCase() === inputHash.toLowerCase();
    }

    /**
     * Lấy địa chỉ IP client (hỗ trợ proxy/load balancer)
     */
    static getIpAddress(req) {
        const forwarded = req.headers['x-forwarded-for'];
        if (forwarded) {
            return forwarded.split(',')[0].trim();
        }
        return (
            req.connection?.remoteAddress ||
            req.socket?.remoteAddress ||
            '127.0.0.1'
        );
    }

    /**
     * Xử lý toàn bộ response từ VNPay callback
     */
    getFullResponseData(query, hashSecret) {
        // Load tất cả tham số vnp_ vào response data
        for (const [key, value] of Object.entries(query)) {
            if (key.startsWith('vnp_')) {
                this.addResponseData(key, value);
            }
        }

        const orderId      = this.getResponseData('vnp_TxnRef');
        const vnpayTranId  = this.getResponseData('vnp_TransactionNo');
        const vnpResponseCode = this.getResponseData('vnp_ResponseCode');
        const vnpSecureHash   = query['vnp_SecureHash'] || '';
        const orderInfo    = this.getResponseData('vnp_OrderInfo');

        const checkSignature = this.validateSignature(vnpSecureHash, hashSecret);

        if (!checkSignature) {
            return { success: false, message: 'Chữ ký không hợp lệ' };
        }

        return {
            success: vnpResponseCode === '00',
            paymentMethod: 'VNPay',
            orderDescription: orderInfo,
            orderId,
            paymentId:     vnpayTranId,
            transactionId: vnpayTranId,
            token:         vnpSecureHash,
            vnPayResponseCode: vnpResponseCode,
        };
    }
}

module.exports = VnPayLibrary;
