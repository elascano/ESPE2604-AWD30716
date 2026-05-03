<?php

class Patient {
    public $nombre;
    public $cedula;
    public $fecha;
    public $telefono;
    public $correo;
    public $genero;
    public $motivo;
    public $creado_en;

    public function __construct($data) {
        $this->nombre = $data['nombre'] ?? '';
        $this->cedula = $data['cedula'] ?? '';
        $this->fecha = $data['fecha'] ?? '';
        $this->telefono = $data['telefono'] ?? '';
        $this->correo = $data['correo'] ?? '';
        $this->genero = $data['genero'] ?? '';
        $this->motivo = $data['motivo'] ?? '';
        $this->creado_en = new MongoDB\BSON\UTCDateTime();
    }

    public function toArray() {
        return [
            'nombre' => $this->nombre,
            'cedula' => $this->cedula,
            'fecha' => $this->fecha,
            'telefono' => $this->telefono,
            'correo' => $this->correo,
            'genero' => $this->genero,
            'motivo' => $this->motivo,
            'creado_en' => $this->creado_en
        ];
    }
}
