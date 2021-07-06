import EmployeeList from './employee-list';
import Employee from './employee.class';
import EmployeeInterface from './employee.interface';

import "./sass/styles.sass";

const listEmployee = new EmployeeList();

enum Sex {
    male = 0,
    female = 1
}

enum Position {
    'Nhân viên' = 1,
    'Quản lý' = 2,
    'Giám đốc' = 3,
}

interface getValue {
    value: String | Number | any, 
    messenger: String, 
    flag: boolean
}

const addEmployee = () => {
    let flag:Boolean = true;
    let errMes:String = '';

    let id: number = 0, name: String = '', sex: Sex = Sex.male, year: number = 0, position: Position = 1, salary: number = 0;

    id = getLastId();
    
    try {
        let getName: getValue = getValue(name, 'name');
        getName.flag ? name = getName.value : errMes += <string>getName.messenger;

        let getSex: getValue = getValue(sex, 'sex');
        getSex.flag ? sex = getSex.value : errMes += <string>getSex.messenger;

        let getYear: getValue = getValue(year, 'year');
        getYear.flag ? year = getYear.value : errMes += <string>getYear.messenger;

        let getPosition: getValue = getValue(position, 'position');
        getPosition.flag ? position = getPosition.value : errMes += <string>getPosition.messenger;

        let getSalary: getValue = getValue(salary, 'salary');
        getSalary.flag ? salary = getSalary.value : errMes += <string>getSalary.messenger;
        
        flag = getName.flag && getYear.flag && getPosition.flag && getSalary.flag;
    } catch (err) {
        flag = false;
        console.log(err)
    }
    
    if (flag && id !== 0 && name !== '' && year !== 0 && salary !== 0) {
        const employee = new Employee(id, name, sex, year, Position[position], salary);
        listEmployee.addEmployee(employee);
        addToTable(listEmployee);
        
        clearInputElement();
    } else {
        alert("Có gì đó sai sai !! \n" + errMes)
    }

}

const editEmployee = function (this:any) {
    
    let dataId:number = parseInt(this.getAttribute("data-id"));
    let target:number = (listEmployee.list.map((e) => e.getId())).indexOf(<number>dataId);
    
    if (target > -1) {
        let emp:Employee = listEmployee.list[target];
        let template:string = createModal(emp);
        
        // Append modal
        let modal = <HTMLElement>document.getElementById('modal-wrapper');
        modal.innerHTML = template;
        modal.style.display = 'block';

        // add event Close Modal
        let closeModal = document.getElementsByClassName('js-close-modal');
        if (closeModal.length) {
            for (let i = 0; i < closeModal.length; i++) {
                closeModal[i].addEventListener('click', function () {
                    removeModal(modal);
                })
            }
        }

        // add event Update Employee
        let updateEmp = document.getElementsByClassName('js-update-emp');
        if (updateEmp.length) {
            
            for (let i = 0; i < updateEmp.length; i++) {
                updateEmp[i].addEventListener('click', function () {
                    
                    let targetEmp = listEmployee.list[target];
                    let flag:Boolean = true;
                    let errMes:String = '';

                    try {
                        let getName: getValue = getValue(targetEmp.name, 'edit-name');
                        getName.flag ? targetEmp.name = getName.value : errMes += <string>getName.messenger;

                        let getSex: getValue = getValue(targetEmp.sex, 'edit-sex');
                        getSex.flag ? targetEmp.sex = getSex.value : errMes += <string>getSex.messenger;

                        let getYear: getValue = getValue(targetEmp.year, 'edit-year');
                        getYear.flag ? targetEmp.year = getYear.value : errMes += <string>getYear.messenger;

                        let getPosition: getValue = getValue(targetEmp.position, 'edit-position');
                        getPosition.flag ? targetEmp.position = Position[getPosition.value] : errMes += <string>getPosition.messenger;

                        let getSalary: getValue = getValue(targetEmp.salary, 'edit-salary');
                        getSalary.flag ? targetEmp.salary = getSalary.value : errMes += <string>getSalary.messenger;

                        flag = getName.flag && getYear.flag && getPosition.flag && getSalary.flag;

                    } catch (err) {
                        flag = false;
                        console.log(err);
                    }

                    if (flag && targetEmp.name !== '' && targetEmp.year !== 0 && targetEmp.salary !== 0) {
                        listEmployee.list[target] = targetEmp;
                        console.log(listEmployee.list[target])
                        addToTable(listEmployee);
                        
                        // remove Modal
                        removeModal(modal);

                    } else {
                        alert("Có gì đó sai sai !! \n" + errMes)
                    }

                })
            }
        }

    }

}

const deleteEmployee = function(this:any) {
    
    let dataId:number = parseInt(this.getAttribute("data-id"));
    
    if (confirm(`Bạn có chắc là muốn xóa Employee #${dataId}`)) {
        let target:number = (listEmployee.list.map((e) => e.getId())).indexOf(<number>dataId);
        if (target > -1) {
            listEmployee.removeEmployee(target);
            let tr = this.closest("tr");
            tr.remove();
        }

        if (listEmployee.list.length === 0) {
            let template = `
                <tr id="data-empty">
                    <td colspan="7" class="border-0 py-4 px-0">
                        <div class="form-wrapper mb-0 text-center">
                            <p class="mb-0">
                                Không có dữ liệu để hiển thị
                            </p>
                        </div>
                    </td>
                </tr>
            `
            let tbody = <HTMLInputElement>document.getElementById('employee_list');
            tbody.innerHTML = template;
        }
        
    } else {
        return;
    }

}

const addToTable = (empList:EmployeeList):void => {

    let tbody = <HTMLInputElement>document.getElementById('employee_list');
    let template = '';
    
    if (empList.list.length > 0) {
        
        for (let emp of empList.list) {
            template += `
                <tr id="tr-${emp.getId()}" data-id="${emp.getId()}">
                    <td class="text-nowrap">${emp.getId()}</td>
                    <td class="text-nowrap">${emp.name}</td>
                    <td class="text-nowrap">${emp.sex ? 'Nữ' : 'Nam'}</td>
                    <td class="text-nowrap">${emp.year}</td>
                    <td class="text-nowrap">${emp.position}</td>
                    <td class="text-nowrap">${emp.salary} VNĐ</td>
                    <td class="text-right text-nowrap">
                        <a href="#" class="text-warning js-edit-emp" data-id="${emp.getId()}" id="edit-emp-${emp.getId()}">Sửa</a>
                        <span class="px-2"> | </span>
                        <a href="#" class="text-danger js-delete-emp" data-id="${emp.getId()}" id="del-emp-${emp.getId()}">Xóa</a>
                    </td>
                </tr>
            `
        }
    } else {
        
        template += `
            <tr id="data-empty">
                <td colspan="7" class="border-0 py-4 px-0">
                    <div class="form-wrapper mb-0 text-center">
                        <p class="mb-0">
                            Không có dữ liệu để hiển thị
                        </p>
                    </div>
                </td>
            </tr>
        `
    }
    
    tbody.innerHTML = template;

    let btnDelEmp = document.getElementsByClassName('js-delete-emp');
    let btnEditEmp = document.getElementsByClassName('js-edit-emp');
    
    for(let i = 0; i < btnDelEmp.length; i++) {
        var _this = this;
        btnDelEmp[i].addEventListener('click', deleteEmployee)
    }

    for(let i = 0; i < btnEditEmp.length; i++) {
        var _this = this;
        btnEditEmp[i].addEventListener('click', editEmployee)
    }

    // getLengthEmpList();

}

const getValue = (val: String | Number, elm: string): getValue => {
    
    let Obj: getValue = { value: null, messenger: '', flag: true};
    let title:string = (<HTMLInputElement>document.getElementById(elm)).getAttribute('data-name') ? <string>(<HTMLInputElement>document.getElementById(elm)).getAttribute('data-name') : elm;

    // Check empty or null
    if ((<HTMLInputElement>document.getElementById(elm)).value === '') {
        Obj.flag = false;
        Obj.messenger += `Bạn chưa nhập ${title.toUpperCase()}` + '\n';
        document.getElementById(elm)?.classList.add('is-invalid');
        return Obj;
    }

    if (typeof val === 'number') {
        if (!isNaN(+((<HTMLInputElement>document.getElementById(elm)).value))) {
            Obj.value = +((<HTMLInputElement>document.getElementById(elm)).value);
            document.getElementById(elm)?.classList.remove('is-invalid');
        } else {
            Obj.flag = false;
            Obj.messenger += `${title.toUpperCase()} phải là 1 số` + '\n';
            document.getElementById(elm)?.classList.add('is-invalid');
        }
    } else {
        Obj.value = (<HTMLInputElement>document.getElementById(elm)).value;
    }
    return Obj;
}

const getLastId = ():number => {
    let listEmp = listEmployee.list;
    let lastId:number = 0;
   
    if (listEmp.length) {
        lastId = <number>listEmp[listEmp.length - 1].getId() + 1;
    } else {
        lastId = 1;
    }

    return lastId;
}

const createModal = (emp: Employee):string => {
    return `
    <div class="modal fade show" style="display: block;" id="myModal" tabindex="-1">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Employee #${emp.getId()} - ${emp.name}</h5>
                    <button type="button" class="btn-close js-close-modal" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="editEmp">
                        <div class="form-group row mb-4">
                            <label class="col-sm-2 col-form-label">Họ Tên</label>
                            <div class="col-sm-10">
                                <input type="text" class="form-control" id="edit-name" data-name="Họ Tên" placeholder="Nhập tên nhân viên" value="${emp.name}"  />
                            </div>
                        </div>
                        <div class="form-group row mb-4">
                            <label class="col-sm-2 col-form-label">Phái</label>
                            <div class="col-sm-10">
                                <select class="form-select" id="edit-sex" data-name="Phái">
                                    <option value="0" ${!emp.sex ? 'selected' : ''}>Nam</option>
                                    <option value="1" ${emp.sex ? 'selected' : ''}>Nữ</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group row mb-4">
                            <label class="col-sm-2 col-form-label">Năm Sinh</label>
                            <div class="col-sm-10">
                                <input type="text" class="form-control" id="edit-year" data-name="năm sinh" placeholder="Nhập năm sinh" value="${emp.year}"  />
                            </div>
                        </div>
                        <div class="form-group row mb-4">
                            <label class="col-sm-2 col-form-label">Vị Trí</label>
                            <div class="col-sm-10">
                                <select class="form-select" id="edit-position" data-name="Vị trí">
                                    <option value="1">Nhân viên</option>
                                    <option value="2">Quản lý</option>
                                    <option value="3">Giám đốc</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group row mb-4">
                            <label class="col-sm-2 col-form-label">Lương cơ bản</label>
                            <div class="col-sm-10">
                                <div class="input-group">
                                    <input type="text" class="form-control" id="edit-salary" data-name="Lương cơ bản" placeholder="Nhập lương cơ bản" value="${emp.salary}"  />
                                    <span class="input-group-text">VNĐ</span>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary js-close-modal" data-bs-dismiss="modal">Hủy</button>
                    <button type="button" class="btn btn-primary js-update-emp">Lưu</button>
                </div>
            </div>
        </div>
    </div>
    <div class="modal-backdrop fade show js-close-modal"></div>
    `
}

const removeModal = (modal:HTMLElement):void => {
    let myModel = document.getElementById('myModal');
    myModel?.remove();
    modal.style.display = 'none';
}

// const getLengthEmpList = ():string => {
//     return listEmployee.lengthEmployee() + '';
// }

const clearInputElement = ():void => {
    try {
        let inputElm:string[] = ['name', 'year', 'salary'];
        for(let item of inputElm) {
            (<HTMLInputElement>document.getElementById(item))?.classList.remove('is-invalid');
            (<HTMLInputElement>document.getElementById(item)).value = '';
        }
    } catch (err) {
        console.log(err);
    }
}

window.onload = function () {
    const btnAddEmp = document.getElementById('add');
    if(!!btnAddEmp) {
        btnAddEmp.addEventListener("click", function () {
            addEmployee();
        });
    }
}

