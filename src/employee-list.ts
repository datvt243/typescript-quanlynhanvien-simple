import Employee from "./employee.class";

class EmployeeList {
    public list : Employee[] = [];
    constructor() {}

    addEmployee = (emp:Employee):void => {
        this.list.push(emp);
    }

    removeEmployee = (target:number):void => {
        this.list.splice(target, 1);
    }

    lengthEmployee = ():number => {
        return this.list.length
    }
 
}

export default EmployeeList