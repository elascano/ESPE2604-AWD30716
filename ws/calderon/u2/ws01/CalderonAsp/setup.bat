@echo off
setlocal enabledelayedexpansion

cd /d "d:\UNIVERSIDAD\8vo Semestre (Quinto)\WebAv\U2\AspPractice"

REM Create directories
mkdir Models 2>nul
mkdir Controllers 2>nul
mkdir Services 2>nul
mkdir Views\Employee 2>nul
mkdir Views\Home 2>nul
mkdir Views\Shared 2>nul
mkdir wwwroot\css 2>nul
mkdir wwwroot\js 2>nul

echo All directories created successfully!
