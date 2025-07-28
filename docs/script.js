document.addEventListener('DOMContentLoaded', () => {
    // --- بخش متغیرهای عمومی ---
    const protocolGrid = document.getElementById('protocol-grid');
    const outputContainer = document.getElementById('output-container');
    const outputTitle = document.getElementById('output-title');
    const outputBody = document.getElementById('output-body');
    const copyMainBtn = document.querySelector('.copy-main-btn');
    
    let isProcessing = false;
    let currentContentToCopy = '';

    // --- بخش مربوط به دریافت کانفیگ ---
    const protocols = {
        vless: { type: 'sub', url: 'https://raw.githubusercontent.com/F0rc3Run/F0rc3Run/refs/heads/main/splitted-by-protocol/vless/vless_part1.txt' },
        trojan: { type: 'sub', url: 'https://raw.githubusercontent.com/F0rc3Run/F0rc3Run/refs/heads/main/splitted-by-protocol/trojan/trojan_part1.txt' },
        ss: { type: 'sub', url: 'https://raw.githubusercontent.com/F0rc3Run/F0rc3Run/refs/heads/main/splitted-by-protocol/ss/ss.txt' },
        sstp: { type: 'sstp', url: 'https://raw.githubusercontent.com/F0rc3Run/F0rc3Run/refs/heads/main/sstp-configs/sstp_with_country.txt' }
    };

    // --- بخش مربوط به دریافت اندپوینت (با آدرس URL راه دور) ---
    const resultsUrl = 'https://raw.githubusercontent.com/F0rc3Run/free-warp-endpoints/refs/heads/main/docs/results.json'; 
    let allEndpoints = [];
    
    async function fetchAllEndpoints() {
        try {
            const response = await fetch(`${resultsUrl}?v=${new Date().getTime()}`);
            if (!response.ok) throw new Error('فایل نتایج یافت نشد.');
            const data = await response.json();
            allEndpoints = [...(data.ipv4 || []), ...(data.ipv6 || [])];
        } catch (error) {
            console.error(`خطا در دریافت لیست اندپوینت‌ها: ${error.message}`);
        }
    }
    
    // --- توابع اصلی ---

    function showOutputContainer(title) {
        outputContainer.style.display = 'block';
        outputTitle.textContent = title;
        outputBody.innerHTML = ''; 
        copyMainBtn.style.display = 'none'; 
    }
    
    function startLoading(card) {
        isProcessing = true;
        const icon = card.querySelector('.icon');
        if(icon) icon.classList.add('processing');
    }

    function stopLoading(card) {
        isProcessing = false;
        const icon = card.querySelector('.icon');
        if(icon) icon.classList.remove('processing');
    }

    function typeEffect(element, text, callback) {
        let i = 0;
        element.innerHTML = "";
        element.classList.add('typing-cursor');
        const interval = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(interval);
                element.classList.remove('typing-cursor');
                if (callback) callback();
            }
        }, 30);
    }
    
    async function handleProtocolClick(protocolKey, card) {
        startLoading(card);
        const protocol = protocols[protocolKey];
        showOutputContainer(`لینک اشتراک ${protocolKey.toUpperCase()}`);
        
        try {
            const response = await fetch(`${protocol.url}?v=${new Date().getTime()}`);
            let content = await response.text();
            
            outputBody.innerHTML = `<pre></pre>`;
            const preElement = outputBody.querySelector('pre');
            
            if (protocol.type === 'sstp') {
                const lines = content.split('\n').filter(line => line.trim() !== '');
                const randomServer = lines[Math.floor(Math.random() * lines.length)];
                content = `Server: ${randomServer.split(',')[0]}\nUsername: sstp\nPassword: sstp`;
                outputTitle.textContent = 'اطلاعات سرور SSTP';
            }
            
            currentContentToCopy = content;
            copyMainBtn.style.display = 'block';

            typeEffect(preElement, content, () => stopLoading(card));

        } catch (error) {
            outputBody.innerHTML = `<pre>خطا در دریافت اطلاعات.</pre>`;
            stopLoading(card);
        }
    }

    function handleEndpointClick(card) {
        if (allEndpoints.length === 0) {
            alert('لیست سرورها هنوز بارگذاری نشده یا خالی است. لطفاً کمی صبر کنید و دوباره تلاش کنید.');
            return;
        }
        
        startLoading(card);
        showOutputContainer('اندپوینت‌های پیشنهادی');

        setTimeout(() => {
            const randomEndpoints = [...allEndpoints].sort(() => 0.5 - Math.random()).slice(0, 5);
            
            if (randomEndpoints.length > 0) {
                const list = document.createElement('div');
                list.className = 'endpoint-results-list';
                outputBody.appendChild(list);

                randomEndpoints.forEach((endpoint, index) => {
                    const item = document.createElement('div');
                    item.className = 'endpoint-item';
                    item.style.animationDelay = `${index * 100}ms`;
                    item.innerHTML = `
                        <div class="icon-wrapper"><i class="fa-solid fa-server"></i></div>
                        <div class="details"><span class="endpoint-ip">${endpoint}</span></div>
                        <button class="copy-endpoint-btn" title="کپی کردن اندپوینت"><i class="fa-solid fa-copy"></i></button>
                    `;
                    list.appendChild(item);
                });
            } else {
                outputBody.innerHTML = `<p>هیچ سروری برای نمایش یافت نشد.</p>`;
            }
            stopLoading(card);
        }, 1000);
    }

    // --- Event Listeners ---

    protocolGrid.addEventListener('click', (event) => {
        if (isProcessing) return;
        const card = event.target.closest('.protocol-card');
        if (!card) return;

        if (card.id === 'get-endpoints-btn') {
            handleEndpointClick(card);
        } else if (card.dataset.protocol) {
            handleProtocolClick(card.dataset.protocol, card);
        }
    });

    copyMainBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(currentContentToCopy).then(() => {
            const icon = copyMainBtn.querySelector('i');
            icon.classList.remove('fa-copy'); icon.classList.add('fa-check');
            setTimeout(() => {
                icon.classList.remove('fa-check'); icon.classList.add('fa-copy');
            }, 2000);
        });
    });
    
    outputBody.addEventListener('click', (event) => {
        const copyBtn = event.target.closest('.copy-endpoint-btn');
        if (!copyBtn) return;
        const endpointText = copyBtn.closest('.endpoint-item').querySelector('.endpoint-ip').textContent;
        navigator.clipboard.writeText(endpointText).then(() => {
            const icon = copyBtn.querySelector('i');
            icon.classList.remove('fa-copy'); icon.classList.add('fa-check');
            setTimeout(() => {
                icon.classList.remove('fa-check'); icon.classList.add('fa-copy');
            }, 2000);
        });
    });

    // --- اجرای اولیه ---
    fetchAllEndpoints();
});
