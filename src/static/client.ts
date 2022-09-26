/*
// whenever user clicks on element with data-goto attribute, scroll to that message
document.addEventListener('click', (e) => {
  const target = e.target;
  const goto = target.getAttribute('data-goto');
  if (goto) {
    const message = document.getElementById(`m-${goto}`);
    if (message) {
      message.scrollIntoView({ behavior: 'smooth' });
    }
  }
});
*/
export const scrollToMessage =
  'document.addEventListener("click",t=>{const e=t.target.getAttribute("data-goto");if(e){const t=document.getElementById(`m-${e}`);t&&t.scrollIntoView({behavior:"smooth"})}});';

/*
wait for 

*/
