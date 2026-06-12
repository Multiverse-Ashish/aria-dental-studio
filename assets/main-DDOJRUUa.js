/* empty css              */(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))s(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const r of t.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function c(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function s(e){if(e.ep)return;e.ep=!0;const t=c(e);fetch(e.href,t)}})();document.addEventListener("DOMContentLoaded",()=>{T(),U(),J(),H(),G(),K(),Q(),V()});function T(){const o=document.querySelector(".menu-toggle"),n=document.querySelector(".nav-menu"),c=document.querySelector(".navbar");o&&n&&(o.addEventListener("click",()=>{o.classList.toggle("active"),n.classList.toggle("active"),document.body.style.overflow=n.classList.contains("active")?"hidden":""}),n.querySelectorAll(".nav-link").forEach(s=>{s.addEventListener("click",()=>{o.classList.remove("active"),n.classList.remove("active"),document.body.style.overflow=""})})),window.addEventListener("scroll",()=>{c&&(window.scrollY>60?c.style.boxShadow="0 4px 30px rgba(197,168,128,0.1)":c.style.boxShadow="none")},{passive:!0})}function U(){const o=document.querySelector(".comparison-wrapper");if(!o)return;const n=o.querySelector(".comparison-before"),c=o.querySelector(".comparison-slider-handle");if(!n||!c)return;let s=!1;const e=r=>{const i=Math.max(5,Math.min(95,r));if(n.style.width=`${i}%`,c.style.left=`${i}%`,n.querySelector("img")){const v=o.offsetWidth;n.querySelector("img").style.width=`${v}px`}},t=r=>{const i=o.getBoundingClientRect();return(r-i.left)/i.width*100};e(50),c.addEventListener("mousedown",r=>{s=!0,r.preventDefault()}),c.addEventListener("touchstart",r=>{s=!0},{passive:!0}),o.addEventListener("mousedown",r=>{s=!0,e(t(r.clientX))}),o.addEventListener("touchstart",r=>{s=!0,e(t(r.touches[0].clientX))},{passive:!0}),document.addEventListener("mousemove",r=>{s&&e(t(r.clientX))}),document.addEventListener("touchmove",r=>{s&&e(t(r.touches[0].clientX))},{passive:!0}),document.addEventListener("mouseup",()=>{s=!1}),document.addEventListener("touchend",()=>{s=!1})}function J(){const o=[document.getElementById("booking-step-1"),document.getElementById("booking-step-2")],n=document.getElementById("booking-step-success"),c=document.getElementById("booking-next"),s=document.getElementById("booking-prev"),e=document.getElementById("booking-actions"),t=[document.getElementById("node-1"),document.getElementById("node-2"),document.getElementById("node-3")],r=document.querySelector(".booking-step-line-active");let i=0;const v=()=>{o.forEach((l,m)=>l.classList.toggle("active",m===i)),n&&n.classList.remove("active"),t.forEach((l,m)=>{l.classList.toggle("active",m===i),l.classList.toggle("completed",m<i)}),r&&(r.style.width=i===0?"0%":"50%"),s&&(s.style.visibility=i===0?"hidden":"visible"),c&&(c.textContent=i===0?"Next Step":"Confirm Booking")};c&&c.addEventListener("click",()=>{i<o.length-1?(i++,v()):L()}),s&&s.addEventListener("click",()=>{i>0&&(i--,v())}),document.querySelectorAll(".service-card").forEach(l=>{l.addEventListener("click",()=>{document.querySelectorAll(".service-card").forEach(E=>E.classList.remove("selected")),l.classList.add("selected");const m=l.dataset.service,g=document.getElementById("booking-service");g&&m&&(g.value=m)})});const d=document.getElementById("upload-box"),f=document.getElementById("profile-file-input"),a=document.getElementById("preview-wrapper"),u=document.getElementById("preview-img"),y=document.getElementById("remove-photo-btn");d&&f&&(d.addEventListener("click",()=>f.click()),f.addEventListener("change",l=>{const m=l.target.files[0];if(!m)return;const g=new FileReader;g.onload=E=>{u&&(u.src=E.target.result),a&&(a.style.display="block",a.classList.add("active"))},g.readAsDataURL(m)}),d.addEventListener("dragover",l=>{l.preventDefault(),d.classList.add("drag-over")}),d.addEventListener("dragleave",()=>d.classList.remove("drag-over")),d.addEventListener("drop",l=>{l.preventDefault(),d.classList.remove("drag-over");const m=l.dataTransfer.files[0];if(!m)return;const g=new FileReader;g.onload=E=>{u&&(u.src=E.target.result),a&&(a.style.display="block",a.classList.add("active"))},g.readAsDataURL(m)})),y&&a&&f&&y.addEventListener("click",l=>{l.stopPropagation(),a.style.display="none",a.classList.remove("active"),f.value=""});function L(){var A,C,O,$,D,N,P,M,X;const l=((C=(A=document.getElementById("booking-name"))==null?void 0:A.value)==null?void 0:C.trim())||"—",m=(($=(O=document.getElementById("booking-email"))==null?void 0:O.value)==null?void 0:$.trim())||"—",g=((D=document.getElementById("booking-date"))==null?void 0:D.value)||"",E=((P=(N=document.getElementById("booking-notes"))==null?void 0:N.value)==null?void 0:P.trim())||"None",B=document.getElementById("booking-service"),w=B?(M=B.options[B.selectedIndex])==null?void 0:M.text:"—",b=document.getElementById("booking-practitioner"),R=b?(X=b.options[b.selectedIndex])==null?void 0:X.text:"—",x=p=>{if(!p)return"—";const[I,F,W]=p.split("-");return`${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][parseInt(F)-1]} ${W}, ${I}`};document.getElementById("summary-name")&&(document.getElementById("summary-name").textContent=l),document.getElementById("summary-email")&&(document.getElementById("summary-email").textContent=m),document.getElementById("summary-service")&&(document.getElementById("summary-service").textContent=w),document.getElementById("summary-date")&&(document.getElementById("summary-date").textContent=x(g)),document.getElementById("summary-notes")&&(document.getElementById("summary-notes").textContent=E),document.getElementById("summary-practitioner")&&(document.getElementById("summary-practitioner").textContent=R);const S=document.getElementById("booking-success-modal"),q=document.getElementById("booking-modal-overlay");document.getElementById("modal-name")&&(document.getElementById("modal-name").textContent=l),document.getElementById("modal-service")&&(document.getElementById("modal-service").textContent=w),document.getElementById("modal-date")&&(document.getElementById("modal-date").textContent=x(g)),S&&S.classList.add("active"),q&&q.classList.add("active"),document.body.style.overflow="hidden",o.forEach(p=>p.classList.remove("active")),n&&n.classList.add("active"),e&&(e.style.display="none"),t.forEach((p,I)=>{p.classList.toggle("active",I===2),p.classList.remove("completed")}),r&&(r.style.width="100%")}const k=document.getElementById("modal-close-btn"),h=document.getElementById("booking-modal-overlay");k&&k.addEventListener("click",()=>{const l=document.getElementById("booking-success-modal");l&&l.classList.remove("active"),h&&h.classList.remove("active"),document.body.style.overflow=""}),h&&h.addEventListener("click",()=>{const l=document.getElementById("booking-success-modal");l&&l.classList.remove("active"),h.classList.remove("active"),document.body.style.overflow=""}),v()}function H(){const o=document.querySelector(".carousel-track");if(!o)return;const n=o.querySelectorAll(".carousel-slide"),c=document.querySelectorAll(".indicator"),s=document.querySelector(".prev-btn"),e=document.querySelector(".next-btn");let t=0,r;const i=u=>{t=(u+n.length)%n.length,o.style.transform=`translateX(-${t*100/3}%)`,n.forEach((y,L)=>y.classList.toggle("active",L===t)),c.forEach((y,L)=>y.classList.toggle("active",L===t))},v=()=>{r=setInterval(()=>i(t+1),5e3)},d=()=>{clearInterval(r),v()};s&&s.addEventListener("click",()=>{i(t-1),d()}),e&&e.addEventListener("click",()=>{i(t+1),d()}),c.forEach((u,y)=>{u.addEventListener("click",()=>{i(y),d()})});let f=0;const a=document.querySelector(".carousel-track-wrapper");a&&(a.addEventListener("touchstart",u=>{f=u.touches[0].clientX},{passive:!0}),a.addEventListener("touchend",u=>{const y=f-u.changedTouches[0].clientX;Math.abs(y)>50&&(i(y>0?t+1:t-1),d())})),v()}function G(){const o=document.querySelectorAll(".gallery-filter-btn"),n=document.querySelectorAll(".gallery-card");o.forEach(c=>{c.addEventListener("click",()=>{o.forEach(e=>e.classList.remove("active")),c.classList.add("active");const s=c.dataset.category;n.forEach(e=>{const t=s==="all"||e.dataset.category===s;e.style.opacity="0",e.style.transform="scale(0.97)",e.style.display=t?"block":"none",t&&requestAnimationFrame(()=>{setTimeout(()=>{e.style.opacity="1",e.style.transform="scale(1)",e.style.transition="opacity 0.4s ease, transform 0.4s ease"},20)})})})})}function K(){const o=document.querySelectorAll(".faq-item");o.forEach(n=>{const c=n.querySelector(".faq-question");c&&c.addEventListener("click",()=>{const s=n.classList.contains("active");o.forEach(e=>e.classList.remove("active")),s||n.classList.add("active")})})}function Q(){const o=document.getElementById("whatsapp-btn"),n=document.getElementById("whatsapp-popup"),c=document.getElementById("whatsapp-close"),s=document.getElementById("wa-send-btn"),e=document.getElementById("wa-name"),t=document.getElementById("wa-msg"),r="13105550190";!o||!n||(o.addEventListener("click",()=>{n.classList.toggle("active"),n.classList.contains("active")&&e&&setTimeout(()=>e.focus(),300)}),c&&c.addEventListener("click",()=>n.classList.remove("active")),s&&s.addEventListener("click",()=>{var f,a;const i=(f=e==null?void 0:e.value)==null?void 0:f.trim(),v=(a=t==null?void 0:t.value)==null?void 0:a.trim();if(!i){e==null||e.focus(),e!=null&&e.style&&(e.style.borderColor="red");return}if(!v){t==null||t.focus(),t!=null&&t.style&&(t.style.borderColor="red");return}const d=encodeURIComponent(`Hi! I'm ${i}.

${v}`);window.open(`https://wa.me/${r}?text=${d}`,"_blank"),n.classList.remove("active")}),[e,t].forEach(i=>{i&&i.addEventListener("input",()=>{i.style.borderColor=""})}))}function V(){const o=document.querySelectorAll(".reveal-up, .reveal-left, .reveal-right, .reveal-fade");if(!o.length)return;const n=new IntersectionObserver(c=>{c.forEach(s=>{s.isIntersecting&&(s.target.classList.add("is-visible"),n.unobserve(s.target))})},{threshold:.1,rootMargin:"0px 0px -60px 0px"});o.forEach(c=>n.observe(c))}

// === BOOKING SINGLE FORM OVERRIDE ===
(function() {
  function initNewBooking() {
    var form = document.getElementById('booking-single-form');
    var successInline = document.getElementById('booking-success-inline');
    if (!form) return;

    // Service card image selection
    document.querySelectorAll('.service-card-img').forEach(function(card) {
      card.addEventListener('click', function() {
        document.querySelectorAll('.service-card-img').forEach(function(c) { c.classList.remove('selected'); });
        card.classList.add('selected');
        var radio = card.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;
      });
    });

    // File upload
    var uploadBox = document.getElementById('upload-box');
    var fileInput = document.getElementById('profile-file-input');
    var previewWrapper = document.getElementById('preview-wrapper');
    var previewImg = document.getElementById('preview-img');
    var removeBtn = document.getElementById('remove-photo-btn');
    if (uploadBox && fileInput) {
      uploadBox.addEventListener('click', function() { fileInput.click(); });
      fileInput.addEventListener('change', function(e) {
        var file = e.target.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function(ev) {
          if (previewImg) previewImg.src = ev.target.result;
          if (previewWrapper) { previewWrapper.style.display = 'block'; previewWrapper.classList.add('active'); }
        };
        reader.readAsDataURL(file);
      });
    }
    if (removeBtn && previewWrapper && fileInput) {
      removeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        previewWrapper.style.display = 'none';
        previewWrapper.classList.remove('active');
        fileInput.value = '';
      });
    }

    // Form submit
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var name = (document.getElementById('booking-name') || {}).value || '';
      var email = (document.getElementById('booking-email') || {}).value || '';
      var date = (document.getElementById('booking-date') || {}).value || '';
      var practitionerEl = document.getElementById('booking-practitioner');
      var practitioner = practitionerEl ? practitionerEl.options[practitionerEl.selectedIndex].text : 'First Available';
      var selectedRadio = document.querySelector('input[name="service-type"]:checked');
      var service = selectedRadio ? selectedRadio.value : 'General Care';

      function fmtDate(d) {
        if (!d) return '�';
        var p = d.split('-');
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        return months[parseInt(p[1])-1] + ' ' + parseInt(p[2]) + ', ' + p[0];
      }

      // Update inline summary
      ['summary-name','summary-email','summary-service','summary-date','summary-practitioner'].forEach(function(id) {
        var el = document.getElementById(id);
        if (el) el.textContent = id==='summary-name'?name : id==='summary-email'?email : id==='summary-service'?service : id==='summary-date'?fmtDate(date) : practitioner;
      });

      // Show modal
      var modal = document.getElementById('booking-success-modal');
      var overlay = document.getElementById('booking-modal-overlay');
      if (modal) modal.classList.add('active');
      if (overlay) overlay.classList.add('active');
      document.body.style.overflow = 'hidden';

      // Show success inline
      form.style.display = 'none';
      if (successInline) successInline.style.display = 'block';
      var bookingEl = document.getElementById('booking');
      if (bookingEl) bookingEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNewBooking);
  } else {
    initNewBooking();
  }
})();