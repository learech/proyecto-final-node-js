import cartService from '../services/carts.service.js'

export const getApiSession = (req,res)=>{
  const data = req.session.user
  res.send(JSON.stringify(data))
}


export const sessionGetRegister = (req, res) => {
  res.status(200).render("register", {
    style: "register.css",
    title: "Register",
  }); 
}
export const sessionPostRegister = (req, res) => {
  if (!req.user) {
    return res.json({ error: "something went wrong" });
  }
  
  req.session.user = {
    _id: req.user._id,
    email: req.user.email, 
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    rol: req.user.rol,
    cart:req.user.cart  
  };
  let session = req.session.user
  let rol = req.session.user.rol
    const data={
        title:'Profile',
        style:'profile.css',
        data:session,
        status:'success'
    }
    data[rol] = session
    res.status(200).render('profile', data) 
}
export const sessionGetLogin = (req, res) => {
  res.status(200).render("login", {
    style: "login.css",
    title: "Login",
  });
}
export const sessionPostLogin = async (req, res) => {
  if (!req.user) {
    return res.json({ error: "invalid credentials" });
  }
  req.session.user = {
    _id: req.user._id,
    email: req.user.email, 
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    rol: req.user.rol,
    cart:req.user.cart,
    documents:req.user.documents,
  };

  let session = req.session.user
  let rol = req.session.user.rol
    const data={
        title:'Profile',
        style:'profile.css',
        data:session,
        status:'success'
    }
    data[rol]= session
    res.status(200).render('profile', data)

}
export const sessionGetProfile = async (req, res) => {
    let session = req.session.user
    let rol = req.session.user.rol
    let cartFound = await cartService.getCartById(session.cart)
    let quantity= 0 
    cartFound.products.reduce((acum, item) => {
    quantity = quantity + item.quantity
    }, {})

    const data={
        title:'Profile',
        style:'profile.css',
        data:session,
        cartQuantity:quantity
    }
    data[rol]= session
    res.render('profile', data) 
}
export const sessionGetLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) res.send("Failed Logout");
    return res.status(200).redirect("/session/login");
  });
}
export const sessionGetFailedRegister = (req, res) => {
  res.send("failed user registration");
}
export const sessionGetError = (req,res)=> {
  res.render('error404',{
      style:'error404.css',
      title:'Error 404'
     })
}
 