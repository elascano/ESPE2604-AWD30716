-- phpMyAdmin SQL Dump
-- version 4.9.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 10-03-2025 a las 03:35:01
-- Versión del servidor: 8.0.17
-- Versión de PHP: 7.3.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `economiaf`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `auditoria`
--

CREATE TABLE `auditoria` (
  `id` int(11) NOT NULL,
  `tabla_afectada` varchar(100) COLLATE utf8_spanish2_ci NOT NULL,
  `id_registro` int(11) NOT NULL,
  `usuario_nombre` varchar(50) COLLATE utf8_spanish2_ci NOT NULL,
  `usuario_apellido` varchar(50) COLLATE utf8_spanish2_ci NOT NULL,
  `fecha_hora` datetime DEFAULT CURRENT_TIMESTAMP,
  `accion` enum('INSERT','UPDATE','DELETE') COLLATE utf8_spanish2_ci NOT NULL,
  `valor_antes` text COLLATE utf8_spanish2_ci,
  `valor_despues` text COLLATE utf8_spanish2_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `auditoria`
--

INSERT INTO `auditoria` (`id`, `tabla_afectada`, `id_registro`, `usuario_nombre`, `usuario_apellido`, `fecha_hora`, `accion`, `valor_antes`, `valor_despues`) VALUES
(1, 'perfiles', 3, '', '', '2025-03-09 22:19:45', 'UPDATE', 'Ingreso', 'Ingreso'),
(2, 'usuarios', 45, '', '', '2025-03-09 22:20:43', 'INSERT', NULL, 'Nombre: Alejandro, Apellido: Obando'),
(3, 'ingresos', 19, '', '', '2025-03-09 22:21:11', 'UPDATE', 'Monto: 150.00, Descripción: Recibí por mi mamá', 'Monto: 15220.00, Descripción: Recibí por mi mamá');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `Id` int(11) NOT NULL,
  `Nombre` varchar(64) CHARACTER SET utf8 COLLATE utf8_spanish_ci NOT NULL,
  `CodigoQR` varchar(250) CHARACTER SET utf8 COLLATE utf8_spanish_ci NOT NULL,
  `tipo` varchar(64) CHARACTER SET utf8 COLLATE utf8_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`Id`, `Nombre`, `CodigoQR`, `tipo`) VALUES
(1, 'Salario', '../codigosQR/Ingreso/QRsalario.jpeg', 'ingreso'),
(2, 'Serivicio_basico', '../codigosQR/Egreso/QRServicioBasico.jpeg', 'egreso'),
(3, 'Extra', '../codigosQR/Ingreso/QRIngreso.jpeg', 'ingreso'),
(4, 'Alimento', '../codigosQR/Egreso/QRAlimento.jpeg', 'egreso');

--
-- Disparadores `categorias`
--
DELIMITER $$
CREATE TRIGGER `after_delete_categorias` AFTER DELETE ON `categorias` FOR EACH ROW BEGIN
    INSERT INTO auditoria (tabla_afectada, id_registro, fecha_hora, accion, valor_antes, valor_despues)
    VALUES ('categorias', OLD.id, NOW(), 'DELETE', OLD.nombre, NULL);
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `after_insert_categorias` AFTER INSERT ON `categorias` FOR EACH ROW BEGIN
    INSERT INTO auditoria (tabla_afectada, id_registro, fecha_hora, accion, valor_antes, valor_despues)
    VALUES ('categorias', NEW.id, NOW(), 'INSERT', NULL, CONCAT('Nombre: ', NEW.nombre));
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `after_update_categorias` AFTER UPDATE ON `categorias` FOR EACH ROW BEGIN
    INSERT INTO auditoria (tabla_afectada, id_registro, fecha_hora, accion, valor_antes, valor_despues)
    VALUES ('categorias', OLD.id, NOW(), 'UPDATE', OLD.nombre, NEW.nombre);
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `egresos`
--

CREATE TABLE `egresos` (
  `Id` int(11) NOT NULL,
  `Fecha` date NOT NULL,
  `IdTipo` int(11) NOT NULL,
  `Monto` float NOT NULL,
  `Metodo` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Estado` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'Completado',
  `idUsuario` int(11) NOT NULL,
  `Descripcion` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `FechaRegistro` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `egresos`
--

INSERT INTO `egresos` (`Id`, `Fecha`, `IdTipo`, `Monto`, `Metodo`, `Estado`, `idUsuario`, `Descripcion`, `FechaRegistro`) VALUES
(1, '2025-02-06', 2, 23, 'Efectivo', 'Completado', 8, 'sdasd', '0000-00-00 00:00:00'),
(2, '2024-12-25', 4, 20, 'Efectivo', 'Completado', 8, 'Gasto Vivienda', '0000-00-00 00:00:00'),
(3, '2025-02-06', 4, 1.02, 'Efectivo', 'Completado', 8, 'Gasto Casa', '0000-00-00 00:00:00'),
(4, '2025-03-06', 2, 1.02, 'Efectivo', 'Completado', 8, 'Gasto Casa', '0000-00-00 00:00:00'),
(5, '2025-03-11', 2, 23, 'Transferencia', 'Completado', 8, 'Gasto Casa', '2025-03-01 21:46:11'),
(6, '2025-03-12', 2, 1.03, 'Transferencia', 'Completado', 8, 'Gasto Trabajo', '2025-03-03 08:27:09'),
(7, '2025-03-12', 4, 50, 'Efectivo', 'Completado', 38, 'comida', '2025-03-08 21:59:53');

--
-- Disparadores `egresos`
--
DELIMITER $$
CREATE TRIGGER `after_delete_egresos` AFTER DELETE ON `egresos` FOR EACH ROW BEGIN
    INSERT INTO auditoria (tabla_afectada, id_registro, fecha_hora, accion, valor_antes, valor_despues)
    VALUES ('egresos', OLD.id, NOW(), 'DELETE', 
            CONCAT('Monto: ', OLD.monto, ', Descripción: ', OLD.descripcion), NULL);
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `after_insert_egresos` AFTER INSERT ON `egresos` FOR EACH ROW BEGIN
    INSERT INTO auditoria (tabla_afectada, id_registro, fecha_hora, accion, valor_antes, valor_despues)
    VALUES ('egresos', NEW.id, NOW(), 'INSERT', NULL, CONCAT('Monto: ', NEW.monto, ', Descripción: ', NEW.descripcion));
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `after_update_egresos` AFTER UPDATE ON `egresos` FOR EACH ROW BEGIN
    INSERT INTO auditoria (tabla_afectada, id_registro, fecha_hora, accion, valor_antes, valor_despues)
    VALUES ('egresos', OLD.id, NOW(), 'UPDATE', 
            CONCAT('Monto: ', OLD.monto, ', Descripción: ', OLD.descripcion),
            CONCAT('Monto: ', NEW.monto, ', Descripción: ', NEW.descripcion));
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ingresos`
--

CREATE TABLE `ingresos` (
  `Id` int(11) NOT NULL,
  `Fecha` date NOT NULL,
  `FechaRegistro` datetime NOT NULL,
  `IdTipo` int(11) NOT NULL,
  `Monto` float(8,2) NOT NULL,
  `Metodo` varchar(64) CHARACTER SET utf8 COLLATE utf8_spanish_ci NOT NULL,
  `Estado` varchar(64) CHARACTER SET utf8 COLLATE utf8_spanish_ci NOT NULL DEFAULT 'Completado',
  `idUsuario` int(11) NOT NULL,
  `Descripcion` varchar(250) CHARACTER SET utf8 COLLATE utf8_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `ingresos`
--

INSERT INTO `ingresos` (`Id`, `Fecha`, `FechaRegistro`, `IdTipo`, `Monto`, `Metodo`, `Estado`, `idUsuario`, `Descripcion`) VALUES
(1, '2025-02-20', '0000-00-00 00:00:00', 1, 20.00, 'Efectivo', 'Anulado', 8, 'No hay en este momento nada'),
(3, '2025-02-08', '0000-00-00 00:00:00', 1, 22.00, 'Transferencia', 'Completado', 8, 'sadsadasdsad'),
(4, '2025-02-16', '0000-00-00 00:00:00', 1, 40.50, 'Cheque', 'Completado', 8, 'Pago por inmuebles'),
(18, '2025-03-12', '2025-03-01 17:28:37', 1, 2222.00, 'Transferencia', 'Anulado', 38, 'sadsadasdsd'),
(19, '2025-03-11', '2025-03-01 18:18:24', 3, 15220.00, 'Cheque', 'Completado', 38, 'Recibí por mi mamá'),
(20, '2025-03-06', '2025-03-01 20:43:35', 1, 24.00, 'Efectivo', 'Completado', 38, 'Pago por inmuebles');

--
-- Disparadores `ingresos`
--
DELIMITER $$
CREATE TRIGGER `after_delete_ingresos` AFTER DELETE ON `ingresos` FOR EACH ROW BEGIN
    INSERT INTO auditoria (tabla_afectada, id_registro, fecha_hora, accion, valor_antes, valor_despues)
    VALUES ('ingresos', OLD.id, NOW(), 'DELETE', 
            CONCAT('Monto: ', OLD.monto, ', Descripción: ', OLD.descripcion), NULL);
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `after_insert_ingresos` AFTER INSERT ON `ingresos` FOR EACH ROW BEGIN
    INSERT INTO auditoria (tabla_afectada, id_registro, fecha_hora, accion, valor_antes, valor_despues)
    VALUES ('ingresos', NEW.id, NOW(), 'INSERT', NULL, CONCAT('Monto: ', NEW.monto, ', Descripción: ', NEW.descripcion));
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `after_update_ingresos` AFTER UPDATE ON `ingresos` FOR EACH ROW BEGIN
    INSERT INTO auditoria (tabla_afectada, id_registro, fecha_hora, accion, valor_antes, valor_despues)
    VALUES ('ingresos', OLD.id, NOW(), 'UPDATE', 
            CONCAT('Monto: ', OLD.monto, ', Descripción: ', OLD.descripcion),
            CONCAT('Monto: ', NEW.monto, ', Descripción: ', NEW.descripcion));
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `perfiles`
--

CREATE TABLE `perfiles` (
  `Id` int(11) NOT NULL,
  `Nombre` varchar(64) CHARACTER SET utf8 COLLATE utf8_spanish_ci NOT NULL,
  `Descripcion` varchar(250) CHARACTER SET utf8 COLLATE utf8_spanish_ci NOT NULL,
  `PaginaIngresos` tinyint(1) NOT NULL,
  `AgregarIngreso` tinyint(1) NOT NULL,
  `AnularActivarIngreso` tinyint(1) NOT NULL,
  `EditarIngreso` tinyint(1) NOT NULL,
  `PaginaReportes` tinyint(1) NOT NULL,
  `PaginaGastos` tinyint(1) NOT NULL,
  `AgregarGasto` tinyint(1) NOT NULL,
  `AnularActivarGasto` tinyint(1) NOT NULL,
  `EditarGasto` tinyint(1) NOT NULL,
  `PaginaCategorias` tinyint(1) NOT NULL,
  `AgregarCategoria` tinyint(1) NOT NULL,
  `EditarCategoria` tinyint(1) NOT NULL,
  `PaginaUsuario` tinyint(1) NOT NULL,
  `CrearUsuario` tinyint(1) NOT NULL,
  `ActivarDesactivarUsuario` tinyint(1) NOT NULL,
  `CrearRol` tinyint(1) NOT NULL,
  `PaginaAuditoria` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `perfiles`
--

INSERT INTO `perfiles` (`Id`, `Nombre`, `Descripcion`, `PaginaIngresos`, `AgregarIngreso`, `AnularActivarIngreso`, `EditarIngreso`, `PaginaReportes`, `PaginaGastos`, `AgregarGasto`, `AnularActivarGasto`, `EditarGasto`, `PaginaCategorias`, `AgregarCategoria`, `EditarCategoria`, `PaginaUsuario`, `CrearUsuario`, `ActivarDesactivarUsuario`, `CrearRol`, `PaginaAuditoria`) VALUES
(1, 'Admin', 'Controla todo dentro del sistema', 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0),
(3, 'Ingreso', 'Controla solo la página de ingresos', 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0),
(4, 'Egresos', 'Controla solo la página de gastos', 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0);

--
-- Disparadores `perfiles`
--
DELIMITER $$
CREATE TRIGGER `after_delete_perfiles` AFTER DELETE ON `perfiles` FOR EACH ROW BEGIN
    INSERT INTO auditoria (tabla_afectada, id_registro, fecha_hora, accion, valor_antes, valor_despues)
    VALUES ('perfiles', OLD.id, NOW(), 'DELETE', OLD.nombre, NULL);
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `after_insert_perfiles` AFTER INSERT ON `perfiles` FOR EACH ROW BEGIN
    INSERT INTO auditoria (tabla_afectada, id_registro, fecha_hora, accion, valor_antes, valor_despues)
    VALUES ('perfiles', NEW.id, NOW(), 'INSERT', NULL, CONCAT('Nombre: ', NEW.nombre));
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `after_update_perfiles` AFTER UPDATE ON `perfiles` FOR EACH ROW BEGIN
    INSERT INTO auditoria (tabla_afectada, id_registro, fecha_hora, accion, valor_antes, valor_despues)
    VALUES ('perfiles', OLD.id, NOW(), 'UPDATE', OLD.nombre, NEW.nombre);
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `Id` int(11) NOT NULL,
  `Cedula` bigint(10) NOT NULL,
  `Nombre` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `Apellido` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `Correo` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `Password` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `Rol` int(11) NOT NULL,
  `Estado` enum('Activo','Inactivo') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'Activo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`Id`, `Cedula`, `Nombre`, `Apellido`, `Correo`, `Password`, `Rol`, `Estado`) VALUES
(8, 1726621830, 'Bryan', 'Quispe', 'asfsafasf@afasfasf.com', '$2y$10$/umyUyF/tUkKeqD03.87/uvdx7Wlc/psgBQaBcp/dbcH9eN.DmzwS', 1, 'Inactivo'),
(38, 2222222222, 'Juan Roberto', 'Perez Salazar', 'rquisper406@gmail.com', '$2y$10$NFBeHMQsGrWnU7RInA7/2OMxjtmp5CzdfVEc/wMS75DBGUzY78HP.', 1, 'Activo'),
(39, 4534564564, 'dsadsad', 'asdsad', 'fjuj_djsrn32@juaxe.com', '$2y$10$vYNZDpqzgpwhFWO.0MZ6k.vFThPtrgVnv7yf/pMIiH4FKK4C92IaO', 0, 'Activo'),
(40, 1111111111, 'dsadad', 'sadassadsa', 'Mateo406@sdadd.com', '$2y$10$1He7mT5EpD/QmipvyMf5S.CJdEiLEg97E.1AVZg5y/YzzbOJpCNdG', 0, 'Activo'),
(42, 1234567890, 'Admin', 'Administrador', 'admin@admin.com', '$2y$10$00Z/FBydxbR1Mev4AftmGu9i2rH61MrODMegFy9QgVHvmcFH5bxm.', 0, 'Inactivo'),
(44, 1755281399, 'Mateo', 'Medranda', 'matemedranda15@gmail.com', '$2y$10$mgWy9yNnUi2VP6RPDYKyR.qVIyRmgm9SAJ9kK6dCiVbfgFC8XzKjy', 1, 'Activo'),
(45, 1721623369, 'Alejandro', 'Obando', 'alejobando599@gmail.com', '$2y$10$4OmahD/de0gLj7zk9a8b4.nB1EU40qJMTgwIT7YF9NxV9djDZw4z2', 3, 'Activo');

--
-- Disparadores `usuarios`
--
DELIMITER $$
CREATE TRIGGER `after_delete_usuarios` AFTER DELETE ON `usuarios` FOR EACH ROW BEGIN
    INSERT INTO auditoria (tabla_afectada, id_registro, fecha_hora, accion, valor_antes, valor_despues)
    VALUES ('usuarios', OLD.id, NOW(), 'DELETE', 
            CONCAT('Nombre: ', OLD.nombre, ', Apellido: ', OLD.apellido), NULL);
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `after_insert_usuarios` AFTER INSERT ON `usuarios` FOR EACH ROW BEGIN
    INSERT INTO auditoria (tabla_afectada, id_registro, fecha_hora, accion, valor_antes, valor_despues)
    VALUES ('usuarios', NEW.id, NOW(), 'INSERT', NULL, CONCAT('Nombre: ', NEW.nombre, ', Apellido: ', NEW.apellido));
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `after_update_usuarios` AFTER UPDATE ON `usuarios` FOR EACH ROW BEGIN
    INSERT INTO auditoria (tabla_afectada, id_registro, fecha_hora, accion, valor_antes, valor_despues)
    VALUES ('usuarios', OLD.id, NOW(), 'UPDATE', 
            CONCAT('Nombre: ', OLD.nombre, ', Apellido: ', OLD.apellido),
            CONCAT('Nombre: ', NEW.nombre, ', Apellido: ', NEW.apellido));
END
$$
DELIMITER ;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `auditoria`
--
ALTER TABLE `auditoria`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`Id`);

--
-- Indices de la tabla `egresos`
--
ALTER TABLE `egresos`
  ADD PRIMARY KEY (`Id`);

--
-- Indices de la tabla `ingresos`
--
ALTER TABLE `ingresos`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `FK_INGRESA` (`idUsuario`),
  ADD KEY `FK_PERTENECE` (`IdTipo`);

--
-- Indices de la tabla `perfiles`
--
ALTER TABLE `perfiles`
  ADD PRIMARY KEY (`Id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `Correo` (`Correo`),
  ADD UNIQUE KEY `Cedula` (`Cedula`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `auditoria`
--
ALTER TABLE `auditoria`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `egresos`
--
ALTER TABLE `egresos`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `ingresos`
--
ALTER TABLE `ingresos`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `perfiles`
--
ALTER TABLE `perfiles`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `ingresos`
--
ALTER TABLE `ingresos`
  ADD CONSTRAINT `FK_INGRESA` FOREIGN KEY (`idUsuario`) REFERENCES `usuarios` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_PERTENECE` FOREIGN KEY (`IdTipo`) REFERENCES `categorias` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
