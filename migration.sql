-- MySQL dump 10.13  Distrib 9.6.0, for macos26.3 (arm64)
--
-- Host: localhost    Database: ecommerce
-- ------------------------------------------------------
-- Server version	9.6.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `addresses`
--

DROP TABLE IF EXISTS `addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `addresses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `street` varchar(255) NOT NULL,
  `city` varchar(100) NOT NULL,
  `state` varchar(100) NOT NULL,
  `zip` varchar(20) NOT NULL,
  `country` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `isDefault` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `addresses_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `addresses`
--

LOCK TABLES `addresses` WRITE;
/*!40000 ALTER TABLE `addresses` DISABLE KEYS */;
/*!40000 ALTER TABLE `addresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cartId` int NOT NULL,
  `productId` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `cartId` (`cartId`),
  KEY `productId` (`productId`),
  CONSTRAINT `cart_items_ibfk_151` FOREIGN KEY (`cartId`) REFERENCES `carts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `cart_items_ibfk_152` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carts`
--

DROP TABLE IF EXISTS `carts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int DEFAULT NULL,
  `sessionId` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carts`
--

LOCK TABLES `carts` WRITE;
/*!40000 ALTER TABLE `carts` DISABLE KEYS */;
/*!40000 ALTER TABLE `carts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `slug` varchar(120) NOT NULL,
  `description` text,
  `image` varchar(500) DEFAULT NULL,
  `parentId` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `parentId` (`parentId`),
  CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`parentId`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (22,'Men\'s Clothing','mens-clothing','Premium apparel for men, from casual tees to formal wear.','https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&q=80',NULL,'2026-04-03 06:21:48','2026-04-03 06:21:48'),(23,'Women\'s Clothing','womens-clothing','Elegant and trendy styles for the modern woman.','https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80',NULL,'2026-04-03 06:21:48','2026-04-03 06:21:48'),(24,'Shoes','shoes','High-performance footwear and stylish sneakers.','https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80',NULL,'2026-04-03 06:21:48','2026-04-03 06:21:48'),(25,'Jeans & Denim','jeans','Premium denim in every fit and wash.','https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80',NULL,'2026-04-03 06:21:48','2026-04-03 06:21:48'),(27,'check','check','','',NULL,'2026-04-03 11:06:33','2026-04-03 11:06:33'),(28,'THERMAL MEN','thermal-men','','',NULL,'2026-04-03 11:15:20','2026-04-03 11:15:20');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `appliedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `orderId` int NOT NULL,
  `productId` int NOT NULL,
  `quantity` int NOT NULL,
  `priceAtPurchase` decimal(10,2) NOT NULL,
  `productName` varchar(200) NOT NULL,
  `productImage` varchar(500) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `variantId` int DEFAULT NULL,
  `variantSize` varchar(50) DEFAULT NULL,
  `variantColor` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `orderId` (`orderId`),
  KEY `productId` (`productId`),
  CONSTRAINT `order_items_ibfk_152` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `order_items_ibfk_153` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `status` enum('PENDING','PROCESSING','SHIPPED','DELIVERED','CANCELLED') DEFAULT 'PENDING',
  `total` decimal(10,2) NOT NULL,
  `shippingAddress` json NOT NULL,
  `stripePaymentId` varchar(255) DEFAULT NULL,
  `stripeSessionId` varchar(255) DEFAULT NULL,
  `notes` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_variants`
--

DROP TABLE IF EXISTS `product_variants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_variants` (
  `id` int NOT NULL AUTO_INCREMENT,
  `productId` int NOT NULL,
  `size` varchar(50) NOT NULL,
  `color` varchar(50) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `stock` int DEFAULT '0',
  `sku` varchar(100) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `images` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `variants_sku_unique` (`sku`),
  KEY `product_variants_product_id` (`productId`),
  CONSTRAINT `product_variants_ibfk_1` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=339 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_variants`
--

LOCK TABLES `product_variants` WRITE;
/*!40000 ALTER TABLE `product_variants` DISABLE KEYS */;
INSERT INTO `product_variants` VALUES (209,36,'S','Black',NULL,5,'CLASSIC-OXFORD-SHIRT-B-S','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80\"]'),(210,36,'M','Black',NULL,11,'CLASSIC-OXFORD-SHIRT-B-M','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80\"]'),(211,36,'L','Black',55.00,9,'CLASSIC-OXFORD-SHIRT-B-L','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80\"]'),(212,36,'XL','Black',55.00,5,'CLASSIC-OXFORD-SHIRT-B-XL','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80\"]'),(213,36,'S','Navy',NULL,5,'CLASSIC-OXFORD-SHIRT-N-S','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1583743814966-8936f5b7ec6a?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1598033129183-c4f50c7176c8?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&q=80\"]'),(214,36,'M','Navy',NULL,19,'CLASSIC-OXFORD-SHIRT-N-M','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1583743814966-8936f5b7ec6a?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1598033129183-c4f50c7176c8?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&q=80\"]'),(215,36,'L','Navy',55.00,9,'CLASSIC-OXFORD-SHIRT-N-L','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1583743814966-8936f5b7ec6a?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1598033129183-c4f50c7176c8?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&q=80\"]'),(216,36,'XL','Navy',NULL,18,'CLASSIC-OXFORD-SHIRT-N-XL','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1583743814966-8936f5b7ec6a?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1598033129183-c4f50c7176c8?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&q=80\"]'),(217,36,'S','Sand',55.00,13,'CLASSIC-OXFORD-SHIRT-S-S','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1523381235312-d7286a039401?auto=format&fit=crop&q=80\"]'),(218,36,'M','Sand',NULL,8,'CLASSIC-OXFORD-SHIRT-S-M','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1523381235312-d7286a039401?auto=format&fit=crop&q=80\"]'),(219,36,'L','Sand',NULL,7,'CLASSIC-OXFORD-SHIRT-S-L','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1523381235312-d7286a039401?auto=format&fit=crop&q=80\"]'),(220,36,'XL','Sand',NULL,9,'CLASSIC-OXFORD-SHIRT-S-XL','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1523381235312-d7286a039401?auto=format&fit=crop&q=80\"]'),(221,36,'S','Olive',NULL,9,'CLASSIC-OXFORD-SHIRT-O-S','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&q=80\"]'),(222,36,'M','Olive',NULL,12,'CLASSIC-OXFORD-SHIRT-O-M','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&q=80\"]'),(223,36,'L','Olive',NULL,8,'CLASSIC-OXFORD-SHIRT-O-L','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&q=80\"]'),(224,36,'XL','Olive',NULL,14,'CLASSIC-OXFORD-SHIRT-O-XL','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&q=80\"]'),(225,37,'S','Black',NULL,19,'STANDARD-CREW-TEE-B-S','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80\"]'),(226,37,'M','Black',35.00,7,'STANDARD-CREW-TEE-B-M','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80\"]'),(227,37,'L','Black',NULL,17,'STANDARD-CREW-TEE-B-L','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80\"]'),(228,37,'XL','Black',NULL,9,'STANDARD-CREW-TEE-B-XL','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80\"]'),(229,37,'S','Navy',NULL,7,'STANDARD-CREW-TEE-N-S','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1583743814966-8936f5b7ec6a?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1598033129183-c4f50c7176c8?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&q=80\"]'),(230,37,'M','Navy',NULL,17,'STANDARD-CREW-TEE-N-M','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1583743814966-8936f5b7ec6a?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1598033129183-c4f50c7176c8?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&q=80\"]'),(231,37,'L','Navy',NULL,6,'STANDARD-CREW-TEE-N-L','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1583743814966-8936f5b7ec6a?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1598033129183-c4f50c7176c8?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&q=80\"]'),(232,37,'XL','Navy',NULL,18,'STANDARD-CREW-TEE-N-XL','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1583743814966-8936f5b7ec6a?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1598033129183-c4f50c7176c8?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&q=80\"]'),(233,37,'S','Sand',NULL,11,'STANDARD-CREW-TEE-S-S','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1523381235312-d7286a039401?auto=format&fit=crop&q=80\"]'),(234,37,'M','Sand',NULL,8,'STANDARD-CREW-TEE-S-M','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1523381235312-d7286a039401?auto=format&fit=crop&q=80\"]'),(235,37,'L','Sand',NULL,5,'STANDARD-CREW-TEE-S-L','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1523381235312-d7286a039401?auto=format&fit=crop&q=80\"]'),(236,37,'XL','Sand',NULL,15,'STANDARD-CREW-TEE-S-XL','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1523381235312-d7286a039401?auto=format&fit=crop&q=80\"]'),(237,37,'S','Olive',35.00,9,'STANDARD-CREW-TEE-O-S','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1583743814966-8936f5b7ec6a?auto=format&fit=crop&q=80\"]'),(238,37,'M','Olive',NULL,19,'STANDARD-CREW-TEE-O-M','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1583743814966-8936f5b7ec6a?auto=format&fit=crop&q=80\"]'),(239,37,'L','Olive',NULL,7,'STANDARD-CREW-TEE-O-L','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1583743814966-8936f5b7ec6a?auto=format&fit=crop&q=80\"]'),(240,37,'XL','Olive',NULL,15,'STANDARD-CREW-TEE-O-XL','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1583743814966-8936f5b7ec6a?auto=format&fit=crop&q=80\"]'),(253,39,'S','Original',NULL,6,'CASHMERE-TURTLENECK-O-S','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&q=80\"]'),(254,39,'M','Original',NULL,8,'CASHMERE-TURTLENECK-O-M','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&q=80\"]'),(255,39,'L','Original',NULL,16,'CASHMERE-TURTLENECK-O-L','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&q=80\"]'),(256,39,'XL','Original',NULL,7,'CASHMERE-TURTLENECK-O-XL','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&q=80\"]'),(257,39,'S','Washed Blue',NULL,15,'CASHMERE-TURTLENECK-W-S','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1565084888279-aff9969bb040?auto=format&fit=crop&q=80\"]'),(258,39,'M','Washed Blue',NULL,10,'CASHMERE-TURTLENECK-W-M','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1565084888279-aff9969bb040?auto=format&fit=crop&q=80\"]'),(259,39,'L','Washed Blue',NULL,7,'CASHMERE-TURTLENECK-W-L','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1565084888279-aff9969bb040?auto=format&fit=crop&q=80\"]'),(260,39,'XL','Washed Blue',160.00,6,'CASHMERE-TURTLENECK-W-XL','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1565084888279-aff9969bb040?auto=format&fit=crop&q=80\"]'),(261,39,'S','Dark Indigo',NULL,8,'CASHMERE-TURTLENECK-D-S','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1582418702059-97ebafb35d09?auto=format&fit=crop&q=80\"]'),(262,39,'M','Dark Indigo',NULL,15,'CASHMERE-TURTLENECK-D-M','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1582418702059-97ebafb35d09?auto=format&fit=crop&q=80\"]'),(263,39,'L','Dark Indigo',NULL,8,'CASHMERE-TURTLENECK-D-L','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1582418702059-97ebafb35d09?auto=format&fit=crop&q=80\"]'),(264,39,'XL','Dark Indigo',NULL,14,'CASHMERE-TURTLENECK-D-XL','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1582418702059-97ebafb35d09?auto=format&fit=crop&q=80\"]'),(265,40,'8','Original',NULL,19,'PRO-RUN-SNEAKERS-O-8','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&q=80\"]'),(266,40,'9','Original',NULL,12,'PRO-RUN-SNEAKERS-O-9','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&q=80\"]'),(267,40,'10','Original',135.00,6,'PRO-RUN-SNEAKERS-O-10','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&q=80\"]'),(268,40,'11','Original',NULL,11,'PRO-RUN-SNEAKERS-O-11','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&q=80\"]'),(269,40,'12','Original',NULL,6,'PRO-RUN-SNEAKERS-O-12','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&q=80\"]'),(270,40,'8','Washed Blue',135.00,13,'PRO-RUN-SNEAKERS-W-8','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1565084888279-aff9969bb040?auto=format&fit=crop&q=80\"]'),(271,40,'9','Washed Blue',NULL,14,'PRO-RUN-SNEAKERS-W-9','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1565084888279-aff9969bb040?auto=format&fit=crop&q=80\"]'),(272,40,'10','Washed Blue',135.00,10,'PRO-RUN-SNEAKERS-W-10','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1565084888279-aff9969bb040?auto=format&fit=crop&q=80\"]'),(273,40,'11','Washed Blue',NULL,7,'PRO-RUN-SNEAKERS-W-11','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1565084888279-aff9969bb040?auto=format&fit=crop&q=80\"]'),(274,40,'12','Washed Blue',NULL,6,'PRO-RUN-SNEAKERS-W-12','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1565084888279-aff9969bb040?auto=format&fit=crop&q=80\"]'),(275,40,'8','Dark Indigo',NULL,6,'PRO-RUN-SNEAKERS-D-8','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1582418702059-97ebafb35d09?auto=format&fit=crop&q=80\"]'),(276,40,'9','Dark Indigo',135.00,19,'PRO-RUN-SNEAKERS-D-9','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1582418702059-97ebafb35d09?auto=format&fit=crop&q=80\"]'),(277,40,'10','Dark Indigo',NULL,18,'PRO-RUN-SNEAKERS-D-10','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1582418702059-97ebafb35d09?auto=format&fit=crop&q=80\"]'),(278,40,'11','Dark Indigo',NULL,16,'PRO-RUN-SNEAKERS-D-11','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1582418702059-97ebafb35d09?auto=format&fit=crop&q=80\"]'),(279,40,'12','Dark Indigo',NULL,17,'PRO-RUN-SNEAKERS-D-12','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1582418702059-97ebafb35d09?auto=format&fit=crop&q=80\"]'),(280,41,'8','Original',190.00,5,'LEATHER-CHELSEA-BOOTS-O-8','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&q=80\"]'),(281,41,'9','Original',NULL,12,'LEATHER-CHELSEA-BOOTS-O-9','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&q=80\"]'),(282,41,'10','Original',190.00,9,'LEATHER-CHELSEA-BOOTS-O-10','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&q=80\"]'),(283,41,'11','Original',190.00,19,'LEATHER-CHELSEA-BOOTS-O-11','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&q=80\"]'),(284,41,'12','Original',190.00,18,'LEATHER-CHELSEA-BOOTS-O-12','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&q=80\"]'),(285,41,'8','Washed Blue',NULL,11,'LEATHER-CHELSEA-BOOTS-W-8','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1565084888279-aff9969bb040?auto=format&fit=crop&q=80\"]'),(286,41,'9','Washed Blue',NULL,10,'LEATHER-CHELSEA-BOOTS-W-9','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1565084888279-aff9969bb040?auto=format&fit=crop&q=80\"]'),(287,41,'10','Washed Blue',190.00,14,'LEATHER-CHELSEA-BOOTS-W-10','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1565084888279-aff9969bb040?auto=format&fit=crop&q=80\"]'),(288,41,'11','Washed Blue',NULL,17,'LEATHER-CHELSEA-BOOTS-W-11','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1565084888279-aff9969bb040?auto=format&fit=crop&q=80\"]'),(289,41,'12','Washed Blue',NULL,11,'LEATHER-CHELSEA-BOOTS-W-12','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1565084888279-aff9969bb040?auto=format&fit=crop&q=80\"]'),(290,41,'8','Dark Indigo',190.00,6,'LEATHER-CHELSEA-BOOTS-D-8','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1582418702059-97ebafb35d09?auto=format&fit=crop&q=80\"]'),(291,41,'9','Dark Indigo',NULL,18,'LEATHER-CHELSEA-BOOTS-D-9','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1582418702059-97ebafb35d09?auto=format&fit=crop&q=80\"]'),(292,41,'10','Dark Indigo',190.00,7,'LEATHER-CHELSEA-BOOTS-D-10','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1582418702059-97ebafb35d09?auto=format&fit=crop&q=80\"]'),(293,41,'11','Dark Indigo',NULL,12,'LEATHER-CHELSEA-BOOTS-D-11','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1582418702059-97ebafb35d09?auto=format&fit=crop&q=80\"]'),(294,41,'12','Dark Indigo',190.00,15,'LEATHER-CHELSEA-BOOTS-D-12','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1582418702059-97ebafb35d09?auto=format&fit=crop&q=80\"]'),(295,42,'28','Original',NULL,7,'RAW-SELVEDGE-JEANS-O-28','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&q=80\"]'),(296,42,'30','Original',NULL,10,'RAW-SELVEDGE-JEANS-O-30','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&q=80\"]'),(297,42,'32','Original',155.00,9,'RAW-SELVEDGE-JEANS-O-32','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&q=80\"]'),(298,42,'34','Original',155.00,7,'RAW-SELVEDGE-JEANS-O-34','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&q=80\"]'),(299,42,'36','Original',NULL,15,'RAW-SELVEDGE-JEANS-O-36','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&q=80\"]'),(300,42,'28','Washed Blue',NULL,11,'RAW-SELVEDGE-JEANS-W-28','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1565084888279-aff9969bb040?auto=format&fit=crop&q=80\"]'),(301,42,'30','Washed Blue',155.00,16,'RAW-SELVEDGE-JEANS-W-30','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1565084888279-aff9969bb040?auto=format&fit=crop&q=80\"]'),(302,42,'32','Washed Blue',NULL,13,'RAW-SELVEDGE-JEANS-W-32','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1565084888279-aff9969bb040?auto=format&fit=crop&q=80\"]'),(303,42,'34','Washed Blue',155.00,11,'RAW-SELVEDGE-JEANS-W-34','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1565084888279-aff9969bb040?auto=format&fit=crop&q=80\"]'),(304,42,'36','Washed Blue',155.00,17,'RAW-SELVEDGE-JEANS-W-36','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1565084888279-aff9969bb040?auto=format&fit=crop&q=80\"]'),(305,42,'28','Dark Indigo',NULL,17,'RAW-SELVEDGE-JEANS-D-28','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1582418702059-97ebafb35d09?auto=format&fit=crop&q=80\"]'),(306,42,'30','Dark Indigo',NULL,14,'RAW-SELVEDGE-JEANS-D-30','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1582418702059-97ebafb35d09?auto=format&fit=crop&q=80\"]'),(307,42,'32','Dark Indigo',NULL,15,'RAW-SELVEDGE-JEANS-D-32','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1582418702059-97ebafb35d09?auto=format&fit=crop&q=80\"]'),(308,42,'34','Dark Indigo',NULL,18,'RAW-SELVEDGE-JEANS-D-34','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1582418702059-97ebafb35d09?auto=format&fit=crop&q=80\"]'),(309,42,'36','Dark Indigo',NULL,6,'RAW-SELVEDGE-JEANS-D-36','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1582418702059-97ebafb35d09?auto=format&fit=crop&q=80\"]'),(310,43,'28','Original',95.00,15,'HIGH-RISE-SKINNY-O-28','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&q=80\"]'),(311,43,'30','Original',95.00,6,'HIGH-RISE-SKINNY-O-30','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&q=80\"]'),(312,43,'32','Original',NULL,17,'HIGH-RISE-SKINNY-O-32','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&q=80\"]'),(313,43,'34','Original',NULL,8,'HIGH-RISE-SKINNY-O-34','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&q=80\"]'),(314,43,'36','Original',NULL,14,'HIGH-RISE-SKINNY-O-36','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&q=80\"]'),(315,43,'28','Washed Blue',NULL,7,'HIGH-RISE-SKINNY-W-28','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1565084888279-aff9969bb040?auto=format&fit=crop&q=80\"]'),(316,43,'30','Washed Blue',NULL,14,'HIGH-RISE-SKINNY-W-30','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1565084888279-aff9969bb040?auto=format&fit=crop&q=80\"]'),(317,43,'32','Washed Blue',NULL,11,'HIGH-RISE-SKINNY-W-32','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1565084888279-aff9969bb040?auto=format&fit=crop&q=80\"]'),(318,43,'34','Washed Blue',NULL,6,'HIGH-RISE-SKINNY-W-34','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1565084888279-aff9969bb040?auto=format&fit=crop&q=80\"]'),(319,43,'36','Washed Blue',95.00,6,'HIGH-RISE-SKINNY-W-36','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1565084888279-aff9969bb040?auto=format&fit=crop&q=80\"]'),(320,43,'28','Dark Indigo',NULL,16,'HIGH-RISE-SKINNY-D-28','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1582418702059-97ebafb35d09?auto=format&fit=crop&q=80\"]'),(321,43,'30','Dark Indigo',95.00,13,'HIGH-RISE-SKINNY-D-30','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1582418702059-97ebafb35d09?auto=format&fit=crop&q=80\"]'),(322,43,'32','Dark Indigo',NULL,14,'HIGH-RISE-SKINNY-D-32','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1582418702059-97ebafb35d09?auto=format&fit=crop&q=80\"]'),(323,43,'34','Dark Indigo',95.00,16,'HIGH-RISE-SKINNY-D-34','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1582418702059-97ebafb35d09?auto=format&fit=crop&q=80\"]'),(324,43,'36','Dark Indigo',NULL,12,'HIGH-RISE-SKINNY-D-36','2026-04-03 06:21:48','2026-04-03 06:21:48','[\"https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1582418702059-97ebafb35d09?auto=format&fit=crop&q=80\"]'),(334,44,'34','Black',789.00,25,NULL,'2026-04-03 12:11:31','2026-04-03 12:11:31','[]'),(335,44,'34','gray',50.00,25,NULL,'2026-04-03 12:11:31','2026-04-03 12:11:31','[]'),(336,45,'34','Shade Skin',789.00,50,NULL,'2026-04-03 12:23:37','2026-04-03 12:23:37','[]'),(337,46,'34','Shade Black',789.00,50,NULL,'2026-04-03 12:41:07','2026-04-03 12:41:07','[]'),(338,47,'34','Shade Grey',759.00,0,NULL,'2026-04-03 13:05:08','2026-04-03 13:05:08','[]');
/*!40000 ALTER TABLE `product_variants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `slug` varchar(220) NOT NULL,
  `description` text NOT NULL,
  `shortDescription` varchar(500) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `comparePrice` decimal(10,2) DEFAULT NULL,
  `stock` int DEFAULT '0',
  `images` json NOT NULL,
  `categoryId` int NOT NULL,
  `tags` json DEFAULT NULL,
  `rating` decimal(3,2) DEFAULT '0.00',
  `reviewCount` int DEFAULT '0',
  `isFeatured` tinyint(1) DEFAULT '0',
  `isActive` tinyint(1) DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `categoryId` (`categoryId`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (36,'Classic Oxford Shirt','classic-oxford-shirt','A versatile button-down shirt crafted from premium oxford cotton. Features a tailored fit and structured collar.','Timeless cotton Oxford button-down',45.00,NULL,200,'[\"https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&q=80\"]',22,'[]',4.80,22,1,1,'2026-04-03 06:21:48','2026-04-03 06:21:48'),(37,'Standard Fit Crew Tee','standard-crew-tee','The perfect everyday t-shirt. Mid-weight cotton with a refined crew neck and standard fit.','Essential 100% cotton crew neck',25.00,NULL,200,'[\"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1583743814966-8936f5b7ec6a?auto=format&fit=crop&q=80\"]',22,'[]',4.80,32,0,1,'2026-04-03 06:21:48','2026-04-03 06:21:48'),(39,'Cashmere Turtleneck','cashmere-turtleneck','Luxuriously soft cashmere sweater. Designed for ultimate warmth and a sophisticated look.','Ultra-soft premium cashmere',150.00,NULL,200,'[\"https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1578587018452-892bacefd30e?auto=format&fit=crop&q=80\"]',23,'[]',4.80,10,1,1,'2026-04-03 06:21:48','2026-04-03 06:21:48'),(40,'Pro Run Performance','pro-run-sneakers','Engineered for distance. These sneakers feature high-rebound cushioning and a breathable mesh upper.','High-performance running sneakers',125.00,NULL,200,'[\"https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80\"]',24,'[]',4.80,16,1,1,'2026-04-03 06:21:48','2026-04-03 06:21:48'),(41,'Leather Chelsea Boots','leather-chelsea-boots','Premium full-grain leather boots with elastic side panels and a durable rubber sole.','Classic full-grain leather boots',180.00,NULL,200,'[\"https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1603487742131-4160ec999331?auto=format&fit=crop&q=80\"]',24,'[]',4.80,34,0,1,'2026-04-03 06:21:48','2026-04-03 06:21:48'),(42,'Raw Selvedge Denim','raw-selvedge-jeans','Heavyweight indigo denim that will develop a unique patina over time. Tapered fit, classic styling.','Premium unwashed selvedge denim',145.00,NULL,200,'[\"https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1582418702059-97ebafb35d09?auto=format&fit=crop&q=80\"]',25,'[]',4.80,18,1,1,'2026-04-03 06:21:48','2026-04-03 06:21:48'),(43,'High Rise Skinny','high-rise-skinny','Perfectly stretchy and incredibly flattering. Designed to hold their shape all day long.','Contouring high-rise skinny jeans',85.00,NULL,200,'[\"https://images.unsplash.com/photo-1541099649105-039cd7a84393?auto=format&fit=crop&q=80\", \"https://images.unsplash.com/photo-1565084888279-aca607ecce0c?auto=format&fit=crop&q=80\"]',25,'[]',4.80,39,0,1,'2026-04-03 06:21:48','2026-04-03 06:21:48'),(44,'MEN FEATHER LITE MIXTURE','men-feather-lite-mixture','SUPER SOFT RICHER FEEL WITH SILICON FINISH & BIO WASH\nSUPER COMBO COTTON RICH FABRIC\nLABEL FREE FOR ALL DAY COMFORT\nLOW NECK DESIGN PERFECT FOR WEARING\n3PCS BOX PACKING',NULL,789.00,1400.00,50,'[\"/uploads/products/1775215792373-p23fhb.jpeg\", \"/uploads/products/1775215798048-slt9ct.jpeg\", \"/uploads/products/1775215804319-5uror0.jpeg\", \"/uploads/products/1775215809111-xqqwua.jpeg\", \"/uploads/products/1775215817057-fxhqu0.jpeg\", \"/uploads/products/1775215829832-txje4k.jpeg\"]',28,'[]',0.00,0,1,1,'2026-04-03 11:37:04','2026-04-03 12:11:31'),(45,'MENS FEATHER LITE SOLID','mens-feather-lite-solid','SUPER SOFT RICHER FEEL WITH SILICON FINISH & BIO WASH\nSUPER COMBO COTTON RICH FABRIC\nLABEL FREE FOR ALL DAY COMFORT\nLOW NECK DESIGN PERFECT FOR WEARING\n3PCS BOX PACKING',NULL,789.00,1500.00,48,'[\"/uploads/products/1775218920442-3jykid.jpeg\", \"/uploads/products/1775218926919-rmwn9z.jpeg\", \"/uploads/products/1775218939042-c7l2v2.jpeg\", \"/uploads/products/1775218946491-irdkfo.jpeg\", \"/uploads/products/1775218964130-nnrpr3.jpeg\", \"/uploads/products/1775218978417-f4ck58.jpeg\"]',28,'[]',0.00,0,1,1,'2026-04-03 12:23:37','2026-04-03 12:23:37'),(46,'MENS MERINO REVERSIBLE','mens-merino-reversible','* SUPER SOFT RICHER FEEL WITH SILICON FINISH\n\n& BIO WASH\n\nSUPER COMBO COTTON RICH FABRIC\nLABEL FREE FOR ALL DAY COMFORT\nLOW NECK DESIGN PERFECT FOR WEARING\n3PCS BOX PACKING',NULL,789.00,1500.00,50,'[\"/uploads/products/1775219908793-fddkga.jpeg\", \"/uploads/products/1775219918443-biezb2.jpeg\", \"/uploads/products/1775219925016-uou5r3.jpeg\", \"/uploads/products/1775219935133-i4k3gz.jpeg\", \"/uploads/products/1775219941172-ta1xuk.jpeg\"]',28,'[]',0.00,0,0,1,'2026-04-03 12:41:07','2026-04-03 12:41:07'),(47,'MEN FEATHER LITE MIXTUREE','men-feather-lite-mixturee','SUPER SOFT RICHER FEEL WITH SILICON FINISH & BIO WASH\nSUPER COMBO COTTON RICH FABRIC\nLABEL FREE FOR ALL DAY COMFORT\nLOW NECK DESIGN PERFECT FOR WEARING\n3PCS BOX PACKING',NULL,759.00,1500.00,10,'[\"/uploads/products/1775221388423-tbwo3v.jpeg\", \"/uploads/products/1775221395650-x7w7ew.jpeg\", \"/uploads/products/1775221400386-use6jt.jpeg\", \"/uploads/products/1775221404212-rfysbw.jpeg\", \"/uploads/products/1775221411147-s5agpw.jpeg\", \"/uploads/products/1775221431353-jahpjb.jpeg\"]',28,'[]',0.00,0,0,1,'2026-04-03 13:05:08','2026-04-03 13:05:08');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `productId` int NOT NULL,
  `rating` int NOT NULL,
  `title` varchar(200) DEFAULT NULL,
  `comment` text NOT NULL,
  `isVerified` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `productId` (`productId`),
  CONSTRAINT `reviews_ibfk_151` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_152` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `passwordHash` varchar(255) DEFAULT NULL,
  `role` enum('USER','ADMIN') DEFAULT 'USER',
  `avatar` varchar(500) DEFAULT NULL,
  `isVerified` tinyint(1) DEFAULT '0',
  `otp` varchar(6) DEFAULT NULL,
  `otpExpiry` datetime DEFAULT NULL,
  `token` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `googleId` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  UNIQUE KEY `users_googleId_unique` (`googleId`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'System Administrator','admin@shopnest.com','$2b$10$3xSQTbf0MBjfRMrTPhUsoORRCkoh9pJRLQvnGfOXFH7cu8csUeUY2','ADMIN',NULL,1,NULL,NULL,'eyJhbGciOiJIUzI1NiJ9.eyJpZCI6IjEiLCJlbWFpbCI6ImFkbWluQHNob3BuZXN0LmNvbSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc3NTIxNzQ3NiwiZXhwIjoxNzc3ODA5NDc2fQ.9KDn_pYTOX4Lyj22ox76XtXXMHxdvKSoVLlKHyp-IAw','2026-03-31 12:14:47','2026-04-03 11:57:56',NULL),(2,'Test User','test3@example.com','$2b$12$ECO.U3hejuFus.YGaPrv8O9G55Ksc0yGxBMoZryqX9jSlN6HQ74kK','USER',NULL,0,'518727','2026-04-01 08:00:36',NULL,'2026-04-01 07:50:36','2026-04-01 07:50:36',NULL),(3,'check','check@yopmail.com','$2b$12$Unkax87tzunZzUcQv127kOmB8ncTVbY1UrHAwnpb8n4fJHTJvbRWW','USER',NULL,1,NULL,NULL,NULL,'2026-04-01 07:52:01','2026-04-01 09:05:24',NULL),(4,'Amandeep Kumar','amandeepkumar.flymediatech@gmail.com',NULL,'USER','https://lh3.googleusercontent.com/a/ACg8ocLTchyeMUCrkSHSxM6aAUrFMC2rxBts3N9VCM0gNR9EEacOCQ=s96-c',1,NULL,NULL,'eyJhbGciOiJIUzI1NiJ9.eyJpZCI6IjQiLCJlbWFpbCI6ImFtYW5kZWVwa3VtYXIuZmx5bWVkaWF0ZWNoQGdtYWlsLmNvbSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzc1MjEzMTUzLCJleHAiOjE3Nzc4MDUxNTN9.2Gmr85qL-U49n8JECUMFwijNI5onjCPWWgz5353vZwE','2026-04-01 09:05:30','2026-04-03 10:45:53','106195584352394154333'),(5,'sunandini bhains','sunandini.flymediatech@gmail.com',NULL,'USER','https://lh3.googleusercontent.com/a/ACg8ocI73CgRy1_J1MbdBq75_tZQ8gJrYNcrYpirvIxxm4ERb8eitw=s96-c',1,NULL,NULL,'eyJhbGciOiJIUzI1NiJ9.eyJpZCI6IjUiLCJlbWFpbCI6InN1bmFuZGluaS5mbHltZWRpYXRlY2hAZ21haWwuY29tIiwicm9sZSI6IlVTRVIiLCJpYXQiOjE3NzUwNDIzMzQsImV4cCI6MTc3NzYzNDMzNH0.bw8rSmFb6wGmGf8Yq5bsHIK5gEPAih-1ZJTvMT6emVw','2026-04-01 11:18:54','2026-04-01 11:18:54','103498359229330950862'),(6,'ShopNest VIP User','test@example.com','$2b$12$vB4409EUbIdypNME.n/j2.NVCmVuH5vtZrdg5Nhn7pS5us9wQAXaW','USER',NULL,1,NULL,NULL,'eyJhbGciOiJIUzI1NiJ9.eyJpZCI6IjYiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJyb2xlIjoiVVNFUiIsImlhdCI6MTc3NTA0NDI2NCwiZXhwIjoxNzc3NjM2MjY0fQ.Yn4SPvR-NNLUheIsjoPGDw_B0057teXKJFZWoshNLxI','2026-04-01 11:41:52','2026-04-01 11:51:04',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wishlist_items`
--

DROP TABLE IF EXISTS `wishlist_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wishlist_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `productId` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `productId` (`productId`),
  CONSTRAINT `wishlist_items_ibfk_151` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `wishlist_items_ibfk_152` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wishlist_items`
--

LOCK TABLES `wishlist_items` WRITE;
/*!40000 ALTER TABLE `wishlist_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `wishlist_items` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-03 19:05:30
