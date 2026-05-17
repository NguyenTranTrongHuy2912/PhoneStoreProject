const { GoogleGenerativeAI } = require('@google/generative-ai');
const Product = require('../models/Product');

/**
 * Handle AI Chat queries
 * @route POST /api/chat
 * @access Public
 */
const handleChat = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ success: false, message: 'Vui lòng cung cấp tin nhắn.' });
        }

        // Check if API key is configured
        if (!process.env.GEMINI_API_KEY) {
            // Graceful fallback for missing API Key
            return res.json({
                success: true,
                reply: 'Xin chào! Hiện tại tính năng AI Gợi ý chưa được cấu hình API Key. Quản trị viên vui lòng thêm GEMINI_API_KEY vào biến môi trường để tôi có thể hỗ trợ bạn nhé!',
            });
        }

        // Initialize Gemini AI
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        // Fetch products from database to build context
        const products = await Product.find({}).select('name brand variants specifications').lean();
        
        let productContext = 'Danh sách sản phẩm hiện có tại PhoneStore:\n';
        
        if (products.length === 0) {
            productContext += 'Hiện tại cửa hàng chưa có sản phẩm nào.\n';
        } else {
            products.forEach(p => {
                const basePrice = p.variants && p.variants.length > 0 ? p.variants[0].price : 'Liên hệ';
                productContext += `- ${p.name} (Hãng: ${p.brand}): Giá từ ${basePrice} VND. Cấu hình cơ bản: ${p.specifications?.screen || 'N/A'} màn hình, ${p.specifications?.chip || 'N/A'} chip, ${p.specifications?.battery || 'N/A'} pin.\n`;
            });
        }

        const systemPrompt = `
Bạn là một trợ lý ảo tư vấn khách hàng chuyên nghiệp, nhiệt tình của cửa hàng điện thoại PhoneStore.
Nhiệm vụ của bạn là trả lời các câu hỏi của khách hàng, dựa vào dữ liệu sản phẩm của cửa hàng.
Bạn cũng có thể trả lời các câu hỏi giao tiếp xã hội bình thường một cách thân thiện.
Nếu khách hàng hỏi về một sản phẩm không có trong danh sách, hãy thông báo là cửa hàng chưa kinh doanh sản phẩm đó và gợi ý các sản phẩm cùng hãng hoặc cùng tầm giá.

Dưới đây là thông tin các sản phẩm cửa hàng đang bán:
---
${productContext}
---

Hãy trả lời ngắn gọn, súc tích, thân thiện và format bằng Markdown để hiển thị đẹp mắt (in đậm, danh sách).
Đừng bao giờ nhắc đến việc bạn được cung cấp dữ liệu bằng một đoạn văn bản hay cơ sở dữ liệu.
        `;

        // We use generateContent instead of startChat for simplicity and statelessness
        // If history is needed in the future, we can accept history array from frontend
        const prompt = `${systemPrompt}\n\nKhách hàng: ${message}\nTrợ lý PhoneStore:`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        res.json({
            success: true,
            reply: responseText,
        });

    } catch (error) {
        console.error('Lỗi khi gọi Gemini API:', error);
        res.status(500).json({
            success: false,
            message: 'Xin lỗi, hệ thống AI đang bận hoặc gặp sự cố. Vui lòng thử lại sau!',
            error: error.message
        });
    }
};

module.exports = {
    handleChat
};
