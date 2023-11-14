class Monstruo extends Personaje{
    constructor(id, nombre, tipo, alias, defensa, miedo, enemigos){
        super(id, nombre, tipo);
        this.alias = alias;
        this.defensa = defensa;
        this.miedo = miedo;
        //recuperatorio
        this.enemigos = enemigos;
    }
}