# SQL Queries

### Menu:

- Select all menu items:
```
SELECT * from items GROUP BY id ORDER BY id;
```

### All Users:

- Select all users:

```
SELECT * from users GROUP BY id ORDER BY id;
```

### Order Totals:

- Select all items, including price and quantity, in an order:

```
SELECT items.title, items.price, orders_items.quantity from items JOIN orders_items  on orders_items.item_id = items.id JOIN orders on orders.id = orders_items.order_id WHERE orders.id = 1 GROUP BY items.title, items.price, orders_items.quantity;
```

- Calculate the sum of an order based on item selection and quantity:

```
SELECT sum(orders_items.quantity * items.price) from orders_items JOIN orders on orders.id = order_id JOIN items on item_id = items.id  WHERE orders.id = 1;
```

### Modifying Order:

- Add a new item to an order:

- update order quantity:

- Delete an item from an order:



