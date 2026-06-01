let slider = document.querySelector('.slider_container');
if (slider) {
    let images = slider.querySelector('.slider_images');
    let slides = slider.querySelectorAll('.slider_images img');
    let index = 0;
    let total = slides.length;
    let next = () => {
        index = (index + 1) % total;
        images.style.transform = `translateX(-${index * 100}%)`;
    };
    let prev = () => {
        index = (index - 1 + total) % total;
        images.style.transform = `translateX(-${index * 100}%)`;
    };
    slider.querySelector('.slider_next').onclick = next;
    slider.querySelector('.slider_prev').onclick = prev;
    setInterval(next, 3000);
}