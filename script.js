class ShoppingCart {
    constructor() {
        this.items = new Map();
        this.loadCart();
        this.renderCart();
    }

    addItem(productName, price) {
        const quantity = this.items.get(productName)?.quantity || 0;
        this.items.set(productName, { price, quantity: quantity + 1 });
        this.saveCart();
        this.renderCart();
    }

    removeItem(productName) {
        this.items.delete(productName);
        this.saveCart();
        this.renderCart();
    }

    getTotal() {
        return [...this.items.values()].reduce((total, item) => {
            return total + item.price * item.quantity;
        }, 0);
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify([...this.items]));
    }

    loadCart() {
        const cartData = localStorage.getItem('cart');
        if (cartData) {
            this.items = new Map(JSON.parse(cartData));
        }
    }

    renderCart() {
        const cartItemsElement = document.querySelector('.cart-items');
        const totalElement = document.querySelector('.total');

        // Clear existing items
        cartItemsElement.innerHTML = '';

        // Add current items
        this.items.forEach((item, productName) => {
            const li = document.createElement('li');
            li.innerHTML = `
                ${productName} 
                <span>¥${item.price} x ${item.quantity}</span>
                <button class="remove-item" data-product="${productName}">×</button>
            `;
            cartItemsElement.appendChild(li);
        });

        // Update total
        totalElement.textContent = `总计：¥${this.getTotal()}`;
    }
}

// Initialize shopping cart
const cart = new ShoppingCart();

// Add event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const productName = button.parentElement.querySelector('h2').textContent;
            const price = parseFloat(button.parentElement.querySelector('.price').textContent.replace('¥', ''));
            cart.addItem(productName, price);
        });
    });

    // Remove item buttons
    document.querySelector('.cart-items').addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-item')) {
            const productName = e.target.dataset.product;
            cart.removeItem(productName);
        }
    });

    // Checkout button
    document.querySelector('.checkout').addEventListener('click', () => {
        if (cart.items.size > 0) {
            document.querySelector('.payment-modal').classList.add('show');
        } else {
            alert('您的购物车是空的');
        }
    });

    // Close modal button
    document.querySelector('.close-modal').addEventListener('click', () => {
        document.querySelector('.payment-modal').classList.remove('show');
        cart.items.clear();
        cart.saveCart();
        cart.renderCart();
    });
});
