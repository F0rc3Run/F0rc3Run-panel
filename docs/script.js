document.addEventListener('DOMContentLoaded', () => {
    // آدرس‌های جدید و پویا برای هر پروتکل
    const protocols = {
        vless: {
            url: 'https://raw.githubusercontent.com/F0rc3Run/F0rc3Run/main/splitted-by-protocol/vless/vless_part1.txt',
            type: 'sub',
            title: 'VLESS Subscription Link'
        },
        trojan: {
            url: 'https://raw.githubusercontent.com/F0rc3Run/F0rc3Run/main/splitted-by-protocol/trojan/trojan_part1.txt',
            type: 'sub',
            title: 'Trojan Subscription Link'
        },
        ss: {
            url: 'https://raw.githubusercontent.com/F0rc3Run/F0rc3Run/main/splitted-by-protocol/ss/ss.txt',
            type: 'sub',
            title: 'ShadowSocks Subscription Link'
        },
        sstp: {
            url: 'https://raw.githubusercontent.com/F0rc3Run/F0rc3Run/main/sstp-configs/sstp_with_country.txt',
            type: 'sstp',
            title: 'SSTP Random Server'
        }
    };

    const protocolGrid = document.getElementById('protocol-grid');
    const outputContainer = document.getElementById('output-container');
    const outputTitle = document.getElementById('output-title');
    const subLinkOutput = document.getElementById('sub-link-output');
    const sstpDetailsOutput = document.getElementById('sstp-details-output');
    const mainCopyBtn = document.querySelector('.copy-main-btn');

    let isProcessing = false;
    let textToCopy = '';

    // افکت تایپ شدن متن
    function typeEffect(element, text, onComplete = () => {}) {
        element.innerHTML = '';
        element.classList.add('typing-cursor');
        let i = 0;
        const interval = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(interval);
                element.classList.remove('typing-cursor');
                onComplete();
            }
        }, 30);
    }
    
    // دریافت و پردازش اطلاعات
    async function handleProtocol(protocol) {
        const { url, type, title } = protocols[protocol];
        outputContainer.style.display = 'block';
        outputTitle.textContent = 'Fetching Data...';
        subLinkOutput.innerHTML = '';
        sstpDetailsOutput.innerHTML = '';

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network error');
            const data = await response.text();
            
            outputTitle.textContent = title;

            if (type === 'sub') {
                textToCopy = data;
                typeEffect(subLinkOutput, data);
            } else if (type === 'sstp') {
                const lines = data.split('\n').filter(line => line.trim());
                if (lines.length === 0) throw new Error('SSTP list is empty');
                
                const randomServer = lines[Math.floor(Math.random() * lines.length)];
                const [hostname, port] = randomServer.split(':');
                
                const details = `Hostname : ${hostname.trim()}\nPort     : ${port.trim()}\nUsername : vpn\nPassword : vpn`;
                textToCopy = details;
                typeEffect(subLinkOutput, details);
            }
        } catch (error) {
            outputTitle.textContent = 'Error';
            typeEffect(subLinkOutput, `Failed to load data. ${error.message}`);
        }
    }

    protocolGrid.addEventListener('click', (event) => {
        const card = event.target.closest('.protocol-card');
        if (!card || isProcessing) return;

        isProcessing = true;
        const icon = card.querySelector('.icon');
        const protocolKey = card.dataset.protocol;
        
        icon.classList.add('processing');

        setTimeout(() => {
            handleProtocol(protocolKey);
            icon.classList.remove('processing');
            isProcessing = false;
        }, 1200);
    });

    mainCopyBtn.addEventListener('click', () => {
        if (!textToCopy) return;
        navigator.clipboard.writeText(textToCopy).then(() => {
            const icon = mainCopyBtn.querySelector('i');
            icon.classList.remove('fa-copy');
            icon.classList.add('fa-check');
            setTimeout(() => {
                icon.classList.remove('fa-check');
                icon.classList.add('fa-copy');
            }, 2000);
        }).catch(err => console.error('Copy failed: ', err));
    });
});
