Full happy-path checkout with a single item

# TC-003

# Step Expected result

1 Launch the application and log in with valid credentials. User is logged in and lands on the Products page.
2 Click Add to cart for the Sauce Labs Backpack. The cart icon shows a badge with the count 1.
3 Click the cart icon in the top navigation. The Cart page opens and displays the Sauce Labs Backpack as the only item.
4 Click the Checkout button. The Your Information page opens.
5 Enter John in the First Name field. Field accepts the input.
6 Enter Doe in the Last Name field. Field accepts the input.
7 Enter 12345 in the Postal Code field. Field accepts the input.
8 Click the Continue button. The Checkout Overview page opens showing the order summary.
9 Verify that the subtotal amount is displayed on the overview page. A subtotal with a dollar amount is visible.
10 Verify that the tax amount is displayed on the overview page. A tax value with a dollar amount is visible.
11 Verify that the order total is displayed on the overview page. A total with a dollar amount is visible.
12 Click the Finish button. The Order Confirmation page opens.
13 Verify the confirmation heading on the page. The heading reads "Thank you for your order!"
14 Verify the confirmation message text is displayed. A descriptive confirmation message is shown below the heading.
15 Verify the Back to Products button is visible. The button is present and clickable.
16 Verify the cart icon in the top navigation. The cart badge is no longer visible, confirming the cart has been cleared.

# TC-004

Test steps

# Step Expected result

1 Launch the application and log in with valid credentials. User is logged in and lands on the Products page.
2 Click Add to cart for the Sauce Labs Backpack. The cart icon shows a badge with the count 1.
3 Click Add to cart for the Sauce Labs Bike Light. The cart badge updates and shows the count 2.
4 Click the cart icon in the top navigation. The Cart page opens and displays both items.
5 Click the Checkout button. The Your Information page opens.
6 Enter Jane in First Name, Smith in Last Name, and 90210 in Postal Code. Click Continue. The Checkout Overview page opens showing the order summary.
7 Verify that both item names are listed in the order overview. Sauce Labs Backpack and Sauce Labs Bike Light are both visible in the summary.
8 Click the Finish button. The Order Confirmation page opens.
9 Verify the confirmation heading on the page. The heading reads "Thank you for your order!"
10 Verify the cart icon in the top navigation. The cart badge is no longer visible, confirming the cart has been cleared.
