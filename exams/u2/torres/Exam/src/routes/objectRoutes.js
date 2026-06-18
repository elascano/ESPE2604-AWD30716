const express = require('express');
const controller = require('../controllers/objectController');
const config = require('../config/appConfig');

const router = express.Router();

function asyncHandler(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

function allowRole(requiredRole) {
  return (req, res, next) => {
    if (config.instanceRole === 'all' || config.instanceRole === requiredRole) {
      return next();
    }

    return res.status(403).json({
      message: `This ${config.instanceRole} instance does not allow ${requiredRole} operations.`,
      instanceRole: config.instanceRole,
      allowedRole: requiredRole
    });
  };
}

router.get('/health', controller.health);
router.get('/metadata', controller.metadata);
router.get('/', allowRole('read'), asyncHandler(controller.listObjects));
router.get('/:id', allowRole('read'), asyncHandler(controller.getObject));
router.post('/', allowRole('write'), asyncHandler(controller.createObject));
router.put('/:id', allowRole('write'), asyncHandler(controller.updateObject));
router.delete('/:id', allowRole('write'), asyncHandler(controller.deleteObject));
router.post('/:id/recompute', allowRole('write'), asyncHandler(controller.recomputeObject));

module.exports = router;
