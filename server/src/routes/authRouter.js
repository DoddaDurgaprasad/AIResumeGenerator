const express=require("express");
const {registerUserController,loginUserController,logoutUserController,getMeController}=require("../controllers/authController");
const authMiddleware= require("../middlewares/authMiddleware")
const router=express.Router();


router.post("/register",registerUserController);
router.post("/login",loginUserController);
router.get('/logout',logoutUserController);
router.get('/get-me',authMiddleware.authUser,getMeController)

module.exports=router;