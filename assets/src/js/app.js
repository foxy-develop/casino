//email validator
const validateEmail = email => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const notification = ( siiimpleToast =
  window.innerWidth < 480
    ? siiimpleToast.setOptions({
        container: "body",
        class: "siiimpleToast",
        position: "top-center",
        margin: 10,
        delay: 0,
        duration: 3000,
        delay: 0
      })
    : siiimpleToast.setOptions({
        container: "body",
        class: "siiimpleToast",
        position: "top-right",
        margin: 10,
        delay: 0,
        duration: 3000,
        delay: 0
      }));

if (document.querySelectorAll('.form').length) {
  
  //form validate
  const formValidate = form => {
    const email = form.querySelector('input[name="mail"]');
    const name = form.querySelector('input[name="name"]');
    const city = form.querySelector('input[name="city"]');

    const error = elem => 
      elem.closest(".form__group").classList.add("form__group--error");
    const success = elem => 
      elem.closest(".form__group").classList.add("form__group--success");

    //validate
    validateEmail(email.value) ? success(email) : error(email);
    name.value.length > 6 ? success(name) : error(name);
    city.value.length >= 4 ? success(city) : error(city);

    return !form.querySelectorAll(".form__group--error").length;
  };

  document.querySelector('.form').addEventListener('submit', function() {
    event.preventDefault();
    if (formValidate(this)) {
      notification.success(
        `Ваше сообщение успешно отправлено! 
        Благодарим за доверие.`
      );
      form.submit();
    } else {
        notification.alert(`При заполнении формы были допущены ошибки. Пожалуйста перепроверьте введенные данные`);
    }
  })

  /* Динамическое отслеживание изменения */
  const check = (cond, el) =>
    cond
      ? el.closest(".form__group").classList.add("form__group--success")
      : el.closest(".form__group").classList.remove("form__group--success");

  document.querySelector('.form').querySelectorAll('input').forEach(el => {
      let container = el.closest(".form__group").classList;
      el.addEventListener('focus', () => 
        container.remove("form__group--error"))
    })

  document.querySelector('input[name="name"]').addEventListener("input", function() {
    check(this.value.length > 6, this)
  });
  document.querySelector('input[name="city"]').addEventListener("input", function() {
    check(this.value.length > 4, this);
  });
  document.querySelector('input[name="mail"]').addEventListener("input", function() {
    check(validateEmail(this.value), this);
  });

}
if (document.querySelector('.slot')) {
  document.querySelector(".slot-start").addEventListener("click", (e) => {
      e.preventDefault;
      document.querySelector(".slot__slot").classList.add('slot__slot--active')
      setTimeout(() => document.querySelector(".slot__slot").classList.remove("slot__slot--active"), 5000);
    }
  ); 
}

if (document.querySelectorAll("[data-form]").length) {
  document.querySelectorAll("[data-form]").forEach(btn => {
    btn.addEventListener("click", () => {
      event.preventDefault();
      document.querySelector(`.modal--${btn.dataset.form}`).classList.add("modal--open");
    });
  });

  document.querySelectorAll(".menu-icon").forEach(btn => {
    btn.addEventListener("click", () => {
      event.preventDefault();
      btn.closest(".modal").classList.add("modal--close");
      setTimeout(()=> {
        btn.closest(".modal").classList.remove("modal--open");
        btn.closest(".modal").classList.remove("modal--close");
      }, 1000)
    });
  });
  document.addEventListener("keydown", function() {
    let openModal = document.querySelector(".modal--open");
     if (event.keyCode === 27 && openModal) {
        openModal.classList.add("modal--close");
        setTimeout(() => {
          openModal.closest(".modal").classList.remove("modal--close");
          openModal.closest(".modal").classList.remove("modal--open");
        }, 1000);
     }
  });
}



//const sw = navigator.serviceWorker;
//sw.controller || sw.register('sw.js', {scope: './'});
