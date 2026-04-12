-- phpMyAdmin SQL Dump
-- version 4.9.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 09-03-2025 a las 20:01:19
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
-- Estructura de tabla para la tabla `perfiles`
--

CREATE TABLE `perfiles` (
  `Id` int(11) NOT NULL,
  `Nombre` varchar(64) COLLATE utf8_spanish_ci NOT NULL,
  `Descripcion` varchar(250) COLLATE utf8_spanish_ci NOT NULL,
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
(3, 'Ingreso', 'Controla solo la página de ingresos', 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
(4, 'Egresos', 'Controla solo la página de gastos', 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `perfiles`
--
ALTER TABLE `perfiles`
  ADD PRIMARY KEY (`Id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `perfiles`
--
ALTER TABLE `perfiles`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
