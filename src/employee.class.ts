class Employee {
    private id: number;
    public name: String;
    public sex: number;
    public year: number;
    public position: string;
    public salary: number;

    constructor (id: number, name: String, sex: number, year: number, position: string, salary: number) {
        this.id = id;
        this.name = name;
        this.sex = sex;
        this.year = year;
        this.position = position;
        this.salary = salary;
    }

    getId = (): number => {
        return this.id;
    }

}

export default Employee