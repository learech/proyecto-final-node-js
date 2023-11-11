
const isUser = (req, res, next) => {
  if (req.session?.user.email) {
    return next()
  }
  return res.status(401).render('error', { error: 'Authentication error!' })
};

const isAdmin = (req, res, next) => {
  if (req.session?.user.role == 'admin') {
    return next()
  }
  return res.status(403).render('error', { error: 'Authorization error!', payload  })
};

const isLogged = (req, res, next) => {
  if(process.env.NODE_ENV === 'DEVELOPMENT' && !req.isAuthenticated() || process.env.NODE_ENV === 'PRODUCTION' && req.isAuthenticated() ) {
    return next()
  };
  return res.redirect('/api/sessions/login')
};

const redirectIfLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect('/views/products');
  };
  return next();
}

const isNotAdmin = (req, res, next) => {
  if (req.session?.user.role !== 'admin') {
    return next();
  };
  return res.status(403).render('error', { error: 'Authorization error!' });
}

const isCartOwner = (req, res, next) => {
  if (req.session?.user.cartId === req.params.cid) {
    return next();
  };
  return res.status(403).render('error', { error: 'Authorization error!' });
}


export {
  isUser,
  isAdmin,
  isLogged,
  redirectIfLoggedIn,
  isNotAdmin,
  isCartOwner,
}
