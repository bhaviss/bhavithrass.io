document.addEventListener("DOMContentLoaded", function () {
    const pages = document.querySelectorAll('.page');
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');

    let currentPage = 0;

    function showPage(index) {
        pages.forEach((page, i) => {
            if (i === index || i === index + 1) {
                page.classList.add('active');
            } else {
                page.classList.remove('active');
            }
        });
    }

    function flipPage(direction) {
        const currentLeftPage = pages[currentPage];
        const currentRightPage = pages[currentPage + 1];

        if (direction === 'next' && currentPage < pages.length - 2) {
            currentLeftPage.classList.add('flipped');
            currentRightPage.classList.add('flipped');
            setTimeout(() => {
                currentPage += 2;
                showPage(currentPage);
            }, 800); // Match the transition duration
        } else if (direction === 'prev' && currentPage > 0) {
            currentLeftPage.classList.remove('flipped');
            currentRightPage.classList.remove('flipped');
            setTimeout(() => {
                currentPage -= 2;
                showPage(currentPage);
            }, 800); // Match the transition duration
        }
    }

    nextBtn.addEventListener('click', () => flipPage('next'));
    prevBtn.addEventListener('click', () => flipPage('prev'));

    // Show first pages initially
    showPage(currentPage);
});