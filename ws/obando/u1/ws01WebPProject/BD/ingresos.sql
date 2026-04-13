-- phpMyAdmin SQL Dump
-- version 4.9.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 09-03-2025 a las 20:01:16
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
(18, '2025-03-12', '2025-03-01 17:28:37', 1, 2222.00, 'Transferencia', 'Completado', 38, 'sadsadasdsd'),
(19, '2025-03-16', '2025-03-01 18:18:24', 1, 150.00, 'Cheque', 'Completado', 38, 'Recibí por mi mamá'),
(20, '2025-03-06', '2025-03-01 20:43:35', 1, 24.00, 'Efectivo', 'Completado', 38, 'Pago por inmuebles');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `ingresos`
--
ALTER TABLE `ingresos`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `FK_INGRESA` (`idUsuario`),
  ADD KEY `FK_PERTENECE` (`IdTipo`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `ingresos`
--
ALTER TABLE `ingresos`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

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
