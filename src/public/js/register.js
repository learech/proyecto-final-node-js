function verificarPasswords() {

  pass1 = document.getElementById('password');
  pass2 = document.getElementById('password2');

  if (pass1.value != pass2.value) {

      document.getElementById("error").classList.add("mostrar");

      return false;
  }
  
  else {

      document.getElementById("error").classList.remove("mostrar");

      document.getElementById("ok").classList.remove("ocultar");

      document.getElementById("login-btn").disabled = true;

      setTimeout(function() {
          window.location.href ="/api/user";
      }, 1000);

      return true;
  }

}  