// সব Donate বাটন
const donationBtns = document.querySelectorAll(
    '#btn_input1, #btn_input2, #btn_input3'
);

// History elements
const historySection = document.getElementById('historySection');
const historyList = document.getElementById('historyList');

// Main balance
const mainBalanceEl = document.getElementById('main_balance');

// click listener
donationBtns.forEach(btn => {
    btn.addEventListener('click', async function () {

        // Active btn color
        donationBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        const section = this.closest('section');
        const input = section.querySelector('input');
        const donateTotalSpan = section.querySelector('.donate-total span');

        const amount = Number(input.value);
        if (amount <= 0 || isNaN(amount)) {
            alert('সঠিক টাকার পরিমাণ লিখো');
            return;
        }

        let mainBalance = getNumberFromText(mainBalanceEl.innerText);
        if (amount > mainBalance) {
            alert('পর্যাপ্ত ব্যালেন্স নেই');
            return;
        }

        // update main balance
        mainBalance -= amount;
        mainBalanceEl.innerHTML = `
        <img class="w-[28px] h-[28px]" src="./assets/coin.png" />
        ${mainBalance} BDT
    `;

        // update card total
        donateTotalSpan.innerText =
            Number(donateTotalSpan.innerText) + amount;

        // get date & time
        const now = new Date();
        const dateTime = now.toLocaleString();

        // get location (if allowed)
        let locationText = 'Location not allowed';
        await getLocation()
            .then(loc => {
                locationText = `Lat: ${loc.latitude.toFixed(4)}, Lng: ${loc.longitude.toFixed(4)}`;
            })
            .catch(err => {
                console.log('Location error:', err);
            });

        // history entry
        const title = section.querySelector('h1').innerText;
        const historyItem = document.createElement('div');
        historyItem.className = 'border p-4 rounded-lg bg-white';

        historyItem.innerHTML = `
      <p class="font-semibold">${title}</p>
      <p class="text-sm text-gray-700">Donation: ${amount} BDT</p>
      <p class="text-sm text-gray-600">Time: ${dateTime}</p>
      <p class="text-sm text-gray-600">${locationText}</p>
    `;

        historyList.prepend(historyItem);

        input.value = '';
    });
});

// convert text to number
function getNumberFromText(text) {
    return parseFloat(text.replace('BDT', ''));
}

// get user location
function getLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject('Geolocation not supported');
        } else {
            navigator.geolocation.getCurrentPosition(
                position => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                error => {
                    reject(error.message);
                }
            );
        }
    });
}

// Donation / history toggle
document.getElementById('donationBtn').addEventListener('click', () => {
    historySection.classList.add('hidden');
});

document.getElementById('historyBtn').addEventListener('click', () => {
    historySection.classList.remove('hidden');
});
