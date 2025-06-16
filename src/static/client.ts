// TODO: create some sort of build system to compile this file

/*
// whenever user clicks on element with data-goto attribute, scroll to that message
document.addEventListener('click', (e) => {
  const target = e.target;
  if(!target) return;

  const goto = target?.getAttribute('data-goto');

  if (goto) {
    const message = document.getElementById(`m-\${goto}`);
    if (message) {
      message.scrollIntoView({ behavior: 'smooth', block: 'center' });
      message.style.backgroundColor = 'rgba(148, 156, 247, 0.1)';
      message.style.transition = 'background-color 0.5s ease';
      setTimeout(() => {
        message.style.backgroundColor = 'transparent';
      }, 1000);
    } else {
      console.warn(`Message \${goto} not found.`);
    }
  }
});
*/
export const scrollToMessage =
  'document.addEventListener("click",t=>{let e=t.target;if(!e)return;let o=e?.getAttribute("data-goto");if(o){let r=document.getElementById(`m-${o}`);r?(r.scrollIntoView({behavior:"smooth",block:"center"}),r.style.backgroundColor="rgba(148, 156, 247, 0.1)",r.style.transition="background-color 0.5s ease",setTimeout(()=>{r.style.backgroundColor="transparent"},1e3)):console.warn("Message ${goto} not found.")}});';

export const revealSpoiler =
  'const s=document.querySelectorAll(".discord-spoiler");s.forEach(s=>s.addEventListener("click",()=>{if(s.classList.contains("discord-spoiler")){s.classList.remove("discord-spoiler");s.classList.add("discord-spoiler--revealed");}}));';
