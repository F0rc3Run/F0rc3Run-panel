document.addEventListener('DOMContentLoaded', () => {
    // --- Global Variables ---
    const protocolGrid = document.getElementById('protocol-grid');
    const outputContainer = document.getElementById('output-container');
    const outputTitle = document.getElementById('output-title');
    const outputBody = document.getElementById('output-body');
    const copyMainBtn = document.querySelector('.copy-main-btn');
    
    let isProcessing = false;
    let currentContentToCopy = '';

    // --- Configs and Endpoints Data ---
    const protocols = {
        vless: { type: 'show_url', url: 'https://raw.githubusercontent.com/F0rc3Run/F0rc3Run/main/splitted-by-protocol/vless/vless_part1.txt' },
        trojan: { type: 'show_url', url: 'https://raw.githubusercontent.com/F0rc3Run/F0rc3Run/main/splitted-by-protocol/trojan/trojan_part1.txt' },
        ss: { type: 'show_url', url: 'https://raw.githubusercontent.com/F0rc3Run/F0rc3Run/main/splitted-by-protocol/ss/ss.txt' },
        telenodes: { type: 'show_url', url: 'https://raw.githubusercontent.com/F0rc3Run/F0rc3Run/main/Special/Telegram.txt' },
        mixprotocol: { type: 'show_url', url: 'https://raw.githubusercontent.com/F0rc3Run/F0rc3Run/main/splitted-by-country/DE.txt' },
        sstp: { type: 'random_sstp', url: 'https://raw.githubusercontent.com/F0rc3Run/F0rc3Run/main/sstp-configs/sstp_with_country.txt' }
    };
    const resultsUrl = 'https://raw.githubusercontent.com/F0rc3Run/free-warp-endpoints/main/docs/results.json'; 
    let allEndpoints = [];
    
    async function fetchAllEndpoints() {
        try {
            const response = await fetch(`${resultsUrl}?v=${new Date().getTime()}`);
            if (!response.ok) throw new Error('Could not fetch results file.');
            const data = await response.json();
            allEndpoints = [...(data.ipv4 || []), ...(data.ipv6 || [])];
        } catch (error) {
            console.error(`Error fetching endpoint list: ${error.message}`);
        }
    }
    
    // --- Core Functions ---
    function showOutputContainer(title) {
        outputContainer.style.display = 'block';
        outputTitle.textContent = title;
        outputBody.innerHTML = ''; 
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
        }, 60);
    }
    
    async function handleProtocolClick(protocolKey, card) {
        startLoading(card);
        const protocol = protocols[protocolKey];
        showOutputContainer(`Result for ${protocolKey.toUpperCase()}`);
        
        if (protocol.type === 'show_url') {
            outputBody.innerHTML = `<pre></pre>`;
            const preElement = outputBody.querySelector('pre');
            const content = protocol.url;

            currentContentToCopy = content;
            copyMainBtn.style.display = 'block';

            typeEffect(preElement, content, () => stopLoading(card));

        } else if (protocol.type === 'random_sstp') {
            copyMainBtn.style.display = 'none';
            outputTitle.textContent = 'SSTP Server Info';
            try {
                const response = await fetch(`${protocol.url}?v=${new Date().getTime()}`);
                const textContent = await response.text();
                const lines = textContent.split('\n').filter(line => line.trim() !== '');

                if (lines.length > 0) {
                    const randomLine = lines[Math.floor(Math.random() * lines.length)];
                    let serverInfo = randomLine.split(',')[0].trim();
                    if (serverInfo.includes('|')) {
                        serverInfo = serverInfo.split('|')[1].trim();
                    }
                    
                    const [hostname, port] = serverInfo.split(':');
                    
                    outputBody.innerHTML = `
                        <div class="sstp-details-list">
                            <div class="sstp-detail-item"><span class="label">Hostname:</span><span class="value" id="sstp-hostname"></span><button class="copy-btn" data-copy="${hostname}" title="Copy"><i class="fa-solid fa-copy"></i></button></div>
                            <div class="sstp-detail-item"><span class="label">Port:</span><span class="value" id="sstp-port"></span><button class="copy-btn" data-copy="${port}" title="Copy"><i class="fa-solid fa-copy"></i></button></div>
                            <div class="sstp-detail-item"><span class="label">Username:</span><span class="value" id="sstp-user"></span><button class="copy-btn" data-copy="vpn" title="Copy"><i class="fa-solid fa-copy"></i></button></div>
                            <div class="sstp-detail-item"><span class="label">Password:</span><span class="value" id="sstp-pass"></span><button class="copy-btn" data-copy="vpn" title="Copy"><i class="fa-solid fa-copy"></i></button></div>
                        </div>
                    `;
                    
                    const hostEl = document.getElementById('sstp-hostname');
                    const portEl = document.getElementById('sstp-port');
                    const userEl = document.getElementById('sstp-user');
                    const passEl = document.getElementById('sstp-pass');

                    typeEffect(hostEl, hostname, () => {
                        typeEffect(portEl, port, () => {
                            typeEffect(userEl, 'vpn', () => {
                                typeEffect(passEl, 'vpn', () => {
                                    stopLoading(card);
                                });
                            });
                        });
                    });

                } else {
                    outputBody.innerHTML = `<p>SSTP server list is empty.</p>`;
                    stopLoading(card);
                }
            } catch (error) {
                outputBody.innerHTML = `<p>Error fetching SSTP server info.</p>`;
                stopLoading(card);
            }
        }
    }

    function handleEndpointClick(card) {
        startLoading(card);
        copyMainBtn.style.display = 'none';
        showOutputContainer('Suggested Endpoints');

        if (allEndpoints.length === 0) {
            alert('Server list is not loaded yet. Please wait a moment and try again.');
            stopLoading(card);
            return;
        }
        
        const randomEndpoints = [...allEndpoints].sort(() => 0.5 - Math.random()).slice(0, 5);
        if (randomEndpoints.length > 0) {
            const list = document.createElement('div');
            list.className = 'endpoint-results-list';
            randomEndpoints.forEach((endpoint) => {
                const item = document.createElement('div');
                item.className = 'endpoint-item';
                item.innerHTML = `
                    <div class="icon-wrapper"><i class="fa-solid fa-server"></i></div>
                    <div class="details"><span class="endpoint-ip">${endpoint}</span></div>
                    <button class="copy-btn" data-copy="${endpoint}" title="Copy"><i class="fa-solid fa-copy"></i></button>
                `;
                list.appendChild(item);
            });
            outputBody.appendChild(list);
        } else {
            outputBody.innerHTML = `<p>No endpoints found to display.</p>`;
        }
        stopLoading(card);
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
    
    outputBody.addEventListener('click', (event) => {
        const copyBtn = event.target.closest('.copy-btn');
        if (!copyBtn) return;
        
        const textToCopy = copyBtn.dataset.copy;
        navigator.clipboard.writeText(textToCopy).then(() => {
            const icon = copyBtn.querySelector('i');
            icon.classList.remove('fa-copy');
            icon.classList.add('fa-check');
            setTimeout(() => {
                icon.classList.remove('fa-check');
                icon.classList.add('fa-copy');
            }, 1500);
        });
    });

    copyMainBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(currentContentToCopy).then(() => {
            const icon = copyMainBtn.querySelector('i');
            icon.classList.remove('fa-copy');
            icon.classList.add('fa-check');
            setTimeout(() => {
                icon.classList.remove('fa-check');
                icon.classList.add('fa-copy');
            }, 1500);
        });
    });

    // --- Initial Execution ---
    fetchAllEndpoints();
});
