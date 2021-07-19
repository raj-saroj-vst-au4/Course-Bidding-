$(document).ready(function () {
  $("#myInput").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    $("#clients_data tr").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
  });

  //login validator
  $("#btn_login").on("click", () => {
    if ($("#student_email")[0].value && $("#student_pass")[0].value) {
      $.ajax({
        method: "POST",
        url: "/api/auth/login",
        data: {
          student_email: $("#student_email")[0].value,
          student_pass: $("#student_pass")[0].value,
        },
        statusCode: {
          200: () => {
            alert("Login Successful");
            location.replace("/");
          },
          401:() => {
              alert("Incorrect ID OR Password")
          },
          500:() => {
              alert("Internal Server Error")
          }
        },
      });
    } else {
      alert("Please enter Valid IITB Email id and Password");
    }
  });

  //register validator
  $("#btn_signup").on("click",
    () => {
        console.log("register clicked")
      if (
        $("#reg_student_email")[0].value &&
        $("#reg_student_fname")[0].value &&
        $("#reg_student_lname")[0].value &&
        $("#reg_student_pass")[0].value &&
        $("#conf_pass")[0].value
      ) {
        if ($("#reg_student_pass")[0].value != $("#conf_pass")[0].value) {
          alert("Password and Confirm Password do not match !");
        }else{
            $.ajax({
                method: "POST",
                url: "/api/auth/signup",
                data: {
                  nstudent_email: $("#reg_student_email")[0].value,
                  nstudent_fname: $("#reg_student_fname")[0].value,
                  nstudent_lname: $("#reg_student_lname")[0].value,
                  nstudent_pass: $("#reg_student_pass")[0].value,
                },
                statusCode: {
                  200: () => {
                    if (window.confirm(
                      "Registration Successful, check mail for confirmation link"
                    )){
                        location.replace("https://webmail.iitb.ac.in");
                    }else{
                        location.replace("/login")
                    };
                  },
                  409: () => {
                    alert("Student Already Exists");
                    location.replace("/login")
                  },
                  500: () => {
                    alert("Incomplete or Invalid Data");
                  },
                },
              });
        }
      }else {
          alert("All Fields are mandatory")
      }
    });
});

// reference code
// $(document).ready(function () {
//   $("#myInput").on("keyup", function () {
//     var value = $(this).val().toLowerCase();
//     $("#clients_data tr").filter(function () {
//       $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
//     });
//   });

//   $("#form_reset").on("click", function () {
//     $("#client_modal_form")[0].reset();
//     $("#client_modal_form *")
//       .filter(".form-control")
//       .each(function () {
//         $(this).removeClass("is-valid");
//         $(this).removeClass("is-invalid");
//       });
//   });

//   $("#modal_add_client_submit").on("click", function () {
//     var valid = true;
//     $("#client_modal_form *")
//       .filter(".form-control")
//       .each(function () {
//         if (this.value === "") {
//           $(this).addClass("is-invalid");
//           $(this).removeClass("is-valid");
//           valid = false;
//         } else {
//           $(this).addClass("is-valid");
//           $(this).removeClass("is-invalid");
//         }
//       });
//     if (valid) {
//       console.log("sending add data");
//       var inputs = document.getElementById("client_modal_form").elements;
//       $.ajax({
//         method: "POST",
//         url: "/add_smt_client_entry",
//         data: {
//           nclient_ref_ph: inputs["input_ref_phone"].value,
//           nclient_ph: inputs["input_client_phone"].value,
//           nclient_name: inputs["input_client_name"].value,
//           nclient_bankname: inputs["input_bankname"].value,
//           nclient_bankaccnum: inputs["input_accountnum"].value,
//           nclient_bankifsc: inputs["input_ifsc"].value,
//           nclient_bankbranch: inputs["input_branch"].value,
//           nclient_bankacctype: inputs["input_type"].value,
//         },
//         statusCode: {
//           200: () => {
//             alert("Entry Added");
//             location.reload();
//           },
//           409: () => {
//             alert("Client Already Exists");
//           },
//           500: () => {
//             alert("Incomplete or Invalid Data");
//           },
//         },
//       });
//     }
//   });

//   $("#modal_client_update_submit").on("click", function () {
//     var inputs = document.getElementById("modal_client_update_form").elements;
//     $.ajax({
//       method: "POST",
//       url: "/edit_smt_client_entry",
//       data: {
//         eclient_name: inputs["client_name"].value,
//         eclient_phone: inputs["client_phone"].value,
//         eclient_ref_phone: inputs["ref_phone"].value,
//         eclient_bankname: inputs["client_bank"].value,
//         eclient_bankaccnum: inputs["client_bank_acc"].value,
//         eclient_bankifsc: inputs["client_bank_ifsc"].value,
//         eclient_bankbranch: inputs["client_bank_branch"].value,
//         eclient_bankacctype: inputs["client_bank_type"].value,
//       },
//       statusCode: {
//         200: () => {
//           alert("Entry Updated");
//           location.reload();
//         },
//         500: () => {
//           alert("Server Down, please try later");
//         },
//       },
//     });
//   });
// });

// //View rows in  js
// function row_view(row) {
//   var row_id = $(row.closest("tr"));
//   //console.log(row_id.find("#row_emp_code").text());
//   $("#view_client_name").val(row_id.find("#row_client_name").text());
//   $("#view_ref_phone").val(row_id.find("#row_client_refphone").text());
//   $("#view_ref_name").val(row_id.find("#row_client_refname").text());
//   $("#view_client_phone").val(row_id.find("#row_client_phone").text());
//   $("#view_bank_branch").val(row_id.find("#row_client_place").text());
//   $("#view_client_bank").val(row_id.find("#row_client_bankname").text());
//   $("#view_bank_acc").val(row_id.find("#row_client_bankaccnum").text());
//   $("#view_bank_ifsc").val(row_id.find("#row_client_bankifsc").text());
//   $("#view_bank_type").val(row_id.find("#row_client_banktype").text());
// }

// //edit rows in  js
// function row_edit(row) {
//   var row_id = $(row.closest("tr"));
//   //console.log(row_id.find("#row_emp_code").text());
//   $("#edit_client_name").val(row_id.find("#row_client_name").text());
//   $("#edit_ref_name").val(row_id.find("#row_client_refname").text());
//   $("#edit_ref_phone").val(row_id.find("#row_client_refphone").text());
//   $("#edit_client_phone").val(row_id.find("#row_client_phone").text());
//   $("#edit_bank_branch").val(row_id.find("#row_client_place").text());
//   $("#edit_client_bank").val(row_id.find("#row_client_bankname").text());
//   $("#edit_bank_acc").val(row_id.find("#row_client_bankaccnum").text());
//   $("#edit_bank_ifsc").val(row_id.find("#row_client_bankifsc").text());
//   $("#edit_bank_type").val(row_id.find("#row_client_banktype").text());
// }

// //deleteable rows in js
// function row_delete(row) {
//   if (confirm("Are you sure?")) {
//     // your deletion code
//     var del_row = row.closest("tr");
//     var del_val = $(row.closest("tr")).find("#row_client_phone").text();

//     $.ajax({
//       method: "POST",
//       url: "/del_smt_client_entry",
//       data: {
//         del_client: del_val,
//       },
//       statusCode: {
//         200: () => {
//           $(del_row).remove();
//         },
//         500: () => {
//           alert("Server Down");
//         },
//       },
//     });
//   }
//   return false;
// }
