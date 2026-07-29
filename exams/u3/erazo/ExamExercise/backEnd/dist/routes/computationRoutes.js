"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const computationController_1 = require("../controllers/computationController");
const router = (0, express_1.Router)();
router.get('/products', computationController_1.listProducts);
router.post('/cart/total', computationController_1.cartTotal);
router.get('/products/:id/iva', computationController_1.productIva);
router.post('/products/:id/expiration', computationController_1.productExpiration);
exports.default = router;
//# sourceMappingURL=computationRoutes.js.map