import { MockService } from "../services/mock.service.js";

const mockService = new MockService;

const getMockingProducts = async (req, res) => {
    try {
        const response = await mockService.getAllMockProducts();

        return res.status(200).json( {success: true, response} );
    }
    catch (error) {
        res.status(500).json({ success: false, result: error.message });
    }
};

export {
    getMockingProducts,
}