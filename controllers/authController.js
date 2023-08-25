  
  import { comparePassword, hashPassword } from '../helpers/authHelper.js';
import userModel from '../models/userModel.js'
import orderModel from '../models/orderModel.js'

import JWT from 'jsonwebtoken'

export  const registerController = async(req,res)=>{
   
    try{
      
        const {name,email,password,phone,address,answer} = req.body;

        if(!name){
            return res.send({msg : "name is required"})
        }
        if(!email){
            return res.send({msg : "email is required"})
        }
        if(!password){
            return res.send({msg : "password is required"})
        }
        if(!phone){
            return res.send({ msg : "phone is required"})
        }
        if(!address){
            return res.send({msg : "address is required"})
        }
        if(!answer){
            return res.send({msg : "answer is required"})
        }

        // check user if already exist ----

        const userExisting = await userModel.findOne({email});

        if(userExisting){
            res.status(200).send({
                success :false,
                msg : "Already registered please login"
            })
        }

        // Register user --
        // hash password
        const hashedPassword = await hashPassword(password);
        // save data-
        const user  = await new userModel({name,email,phone,address,password : hashedPassword,answer}).save();
       
        res.status(201).send({
            success :true,
            msg : "user registered successfully",
            user,
        })

    }catch(err){
        console.log("register controller : ",err);

        res.ststus(500).send({
            success : false,
            msg : "error in registeration",
            err
        })
    }
}


// Post for login

export const loginController = async (req,res) =>{
     try{

        const {email,password} =req.body;
        
        // validation 

        if(!email || !password){
            res.status(404).send({
                success : false,
                msg :"invalid email or password"

            })
        }

        // compare password
        const user = await userModel.findOne({email});
        if(!user){
            res.status(404).send({
                success : false,
                msg :"user not registered"

            })
        }

        const match = await comparePassword(password,user.password);

        
        if(!match){
            res.status(200).send({
                success : false,
                msg :"Invalid password"

            })
        }

        // jwt token creation

        const token = await JWT.sign({_id : user._id}, process.env.JWT_SECRET,{expiresIn :'7d'});

        res.status(200).send({
            success : true,
            msg : "user login successfully",
            user : {
                name : user.name,
                email : user.email,
                phone : user.phone,
                address : user.address,
                role : user.role,
            },
            token,
        });

     }catch(err){
        console.log("login controller : ",err);

        res.status(500).send({
            success : false,
            msg : "error in login",
            err
        })
     }
}

// forgotPasswordController ----

export const forgotPasswordController = async (req,res)=>{
   
    try{
       
        const {email,answer,newPassword} = req.body;

        if(!email){
            res.status(400).send({msg : "email is required"})
        }
        if(!answer){
            res.status(400).send({msg : "answer is required"})
        }
        if(!newPassword){
            res.status(400).send({msg : "newpassword is required"})
        }
        // check email and answer

        const user = await userModel.findOne({email,answer});

        // validate user

        if(!user){
            return res.status(404).send({
                success: false,
                msg: "wrong email or answer",
            })
        }

        const hashed= await hashPassword(newPassword);
        await userModel.findOneAndUpdate(user._id,{password : hashed});

        res.status(200).send({
            success: true,
            msg: "Password reset successfully !",
        })

    }catch(error){
        console.log(error);
    res.status(500).send({
      success: false,
      msg: "Something went wrong",
      error,
    });
    }
}


// test contoller

export const testContoller = (req,res)=>{
   console.log("Protected test route");
   res.send("Protected test route")
}

//update prfole
export const updateProfileController = async (req, res) => {
    try {
      const { name, email, password, address, phone } = req.body;
      const user = await userModel.findById(req.user._id);
      //password
      if (password && password.length < 6) {
        return res.json({ error: "Passsword is required and 6 character long" });
      }
      const hashedPassword = password ? await hashPassword(password) : undefined;
      const updatedUser = await userModel.findByIdAndUpdate(
        req.user._id,
        {
          name: name || user.name,
          password: hashedPassword || user.password,
          phone: phone || user.phone,
          address: address || user.address,
        },
        { new: true }
      );
      res.status(200).send({
        success: true,
        message: "Profile Updated SUccessfully",
        updatedUser,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        success: false,
        message: "Error WHile Update profile",
        error,
      });
    }
  };


  //orders
export const getOrdersController = async (req, res) => {
    try {
      const orders = await orderModel
        .find({ buyer: req.user._id })
        .populate("products", "-photo")
        .populate("buyer", "name");
      res.json(orders);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error While Geting Orders",
        error,
      });
    }
  };
  //orders
  export const getAllOrdersController = async (req, res) => {
    try {
      const orders = await orderModel
        .find({})
        .populate("products", "-photo")
        .populate("buyer", "name")
        .sort({ createdAt: "-1" });
      res.json(orders);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error WHile Geting Orders",
        error,
      });
    }
  };
  
  //order status
  export const orderStatusController = async (req, res) => {
    try {
      const { orderId } = req.params;
      const { status } = req.body;
      const orders = await orderModel.findByIdAndUpdate(
        orderId,
        { status },
        { new: true }
      );
      res.json(orders);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error While Updateing Order",
        error,
      });
    }
  };

//  get all user ----------.

export const getAllUsers = async (req,res) =>{
    try{

      const users = await userModel.find({}).select('_id name email phone role');
      res.json(users);
    }catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error while geting users",
        error,
      });
    }
}