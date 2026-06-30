
(function(){
  const form = document.getElementById('regForm');
  const submitBtn = document.getElementById('submitBtn');

  const fields = {
    fullName: {
      el: document.getElementById('fullName'),
      validate(v){
        v = v.trim();
        if(!v) return 'Enter your full name.';
        if(v.length < 2) return 'Name is too short.';
        if(!/^[A-Za-z\u00C0-\u017F'\-\s]+$/.test(v)) return 'Use letters only, please.';
        return '';
      },
      okMsg(){ return 'Looks good.'; }
    },
    username: {
      el: document.getElementById('username'),
      validate(v){
        if(!v) return 'Choose a username.';
        if(v.length < 3 || v.length > 20) return 'Must be 3–20 characters.';
        if(!/^[A-Za-z0-9_]+$/.test(v)) return 'Only letters, numbers and underscores.';
        return '';
      },
      okMsg(){ return 'Username available format.'; }
    },
    email: {
      el: document.getElementById('email'),
      validate(v){
        v = v.trim();
        if(!v) return 'Enter your email address.';
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if(!re.test(v)) return 'Enter a valid email address.';
        return '';
      },
      okMsg(){ return 'Valid email format.'; }
    },
    phone: {
      el: document.getElementById('phone'),
      validate(v){
        const digits = v.replace(/[^\d]/g,'');
        if(!v.trim()) return 'Enter your phone number.';
        if(digits.length < 7 || digits.length > 15) return 'Enter a valid phone number.';
        if(!/^[\d+\-\s()]+$/.test(v)) return 'Use digits, spaces, + or - only.';
        return '';
      },
      okMsg(){ return 'Valid phone format.'; }
    },
    dob: {
      el: document.getElementById('dob'),
      validate(v){
        if(!v) return 'Select your date of birth.';
        const dob = new Date(v);
        if(isNaN(dob.getTime())) return 'Enter a valid date.';
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        if(m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
        if(dob > today) return 'Date of birth cannot be in the future.';
        if(age < 18) return 'You must be 18 or older.';
        return '';
      },
      okMsg(){ return 'Age requirement met.'; }
    },
    password: {
      el: document.getElementById('password'),
      validate(v){
        if(!v) return 'Create a password.';
        if(v.length < 8) return 'At least 8 characters needed.';
        if(!/[a-z]/.test(v) || !/[A-Z]/.test(v)) return 'Mix uppercase and lowercase letters.';
        if(!/\d/.test(v)) return 'Include at least one number.';
        if(!/[^A-Za-z0-9]/.test(v)) return 'Include at least one symbol.';
        return '';
      },
      okMsg(){ return 'Strong password.'; }
    },
    confirmPassword: {
      el: document.getElementById('confirmPassword'),
      validate(v){
        const pw = document.getElementById('password').value;
        if(!v) return 'Re-enter your password.';
        if(v !== pw) return 'Passwords do not match.';
        return '';
      },
      okMsg(){ return 'Passwords match.'; }
    }
  };

  function setState(name, message){
    const wrap = document.querySelector('[data-field="'+name+'"]');
    const hint = wrap.querySelector('.hint');
    wrap.classList.remove('valid','invalid');
    if(message){
      wrap.classList.add('invalid');
      hint.textContent = message;
    } else {
      wrap.classList.add('valid');
      hint.textContent = fields[name].okMsg();
    }
  }

  function runValidation(name){
    const value = fields[name].el.value;
    const message = fields[name].validate(value);
    setState(name, message);
    return !message;
  }

  Object.keys(fields).forEach(name => {
    const el = fields[name].el;
    el.addEventListener('input', () => {
      runValidation(name);
      if(name === 'password'){
        updateMeter(el.value);
        if(document.getElementById('confirmPassword').value){
          runValidation('confirmPassword');
        }
      }
      updateSubmitState();
    });
    el.addEventListener('blur', () => runValidation(name));
  });

  function updateMeter(pw){
    const meter = document.getElementById('pwMeter');
    let score = 0;
    if(pw.length >= 8) score++;
    if(/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
    if(/\d/.test(pw)) score++;
    if(/[^A-Za-z0-9]/.test(pw)) score++;
    meter.className = 'meter ' + (pw ? 's'+score : '');
  }

  document.querySelectorAll('.toggle-pw').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.target);
      const show = target.type === 'password';
      target.type = show ? 'text' : 'password';
      btn.textContent = show ? 'HIDE' : 'SHOW';
    });
  });

  const terms = document.getElementById('terms');
  const termsHint = document.getElementById('termsHint');
  terms.addEventListener('change', () => {
    termsHint.textContent = terms.checked ? '' : '';
    updateSubmitState();
  });

  function updateSubmitState(){
    const allValid = Object.keys(fields).every(name => {
      const wrap = document.querySelector('[data-field="'+name+'"]');
      return wrap.classList.contains('valid');
    }) && terms.checked;
    submitBtn.disabled = false; // keep clickable; full check happens on submit
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();
    let allValid = true;
    Object.keys(fields).forEach(name => {
      if(!runValidation(name)) allValid = false;
    });
    if(!terms.checked){
      termsHint.textContent = 'You must accept the terms to continue.';
      termsHint.style.color = 'var(--error)';
      allValid = false;
    } else {
      termsHint.textContent = '';
    }
    if(allValid){
      form.classList.add('hide');
      document.getElementById('successPanel').classList.add('show');
    } else {
      const firstInvalid = document.querySelector('.field.invalid input');
      if(firstInvalid) firstInvalid.focus();
    }
  });
})();
