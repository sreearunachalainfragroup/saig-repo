
document.addEventListener('DOMContentLoaded', ()=>{
  const form=document.getElementById('contact-form');
  if(form){
    form.addEventListener('submit', e=>{
      e.preventDefault();
      alert('Message submitted (demo only).');
      // console.log('Form data', {
      //   name: form.name.value, email: form.email.value, message: form.message.value
      // });
      form.reset();
    });
  }
});
