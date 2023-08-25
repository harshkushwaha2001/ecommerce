
import bcrypt from 'bcrypt';

export const hashPassword = async (password)=>{
    
    try{
       
        const saltRound=10;
        
        const hashedPassword = await bcrypt.hash(password,saltRound);

        return hashedPassword

    }catch(err){
      console.log("hash error ",err);
    }
}


export const comparePassword = async (password,hashedPassword)=>{
    
    try{
       
      return bcrypt.compare(password,hashedPassword);

    }catch(err){
      console.log("hash error ",err);
    }
}