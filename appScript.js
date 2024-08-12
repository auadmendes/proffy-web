var mailApp = MailApp;
var app = SpreadsheetApp;
var spreadsheet = app.getActiveSpreadsheet();
var sheet = spreadsheet.getSheetByName("Vacation control");
var ui = app.getUi();


function onOpen(e) {
  SpreadsheetApp.getUi()
    .createMenu('Vacation Report')
    .addItem('Submit', 'sendMail')
    .addToUi()
}


function sendMail() {
  var values = sheet.getDataRange().getValues();

  const filteredPendingItems = values.filter((item) => {
    
    return item[11] !== 'Finished' ; // Filter items with 'Days pending' status
  });

  const pendingItemsByManager = filteredPendingItems.reduce((managers, item) => {
    const managerEmail = item[5]; 
    if (!managers[managerEmail]) {
      managers[managerEmail] = [];
    }
    managers[managerEmail].push(item);
    return managers;
  }, {});

  for (let managerEmail in pendingItemsByManager) {
    const managerName = pendingItemsByManager[managerEmail][0][4]; 


    let pendingList = '';
    pendingItemsByManager[managerEmail].forEach((item) => {
      pendingList += `
      <li>Name: <strong>${item[0]}</strong>, Pending <strong>${item[15]}</strong> days. Limit date ${item[10].toString().substring(0, 15)}</li>`;
    });


  let plannedList = `
    <div class="vacation_list" style="padding: 10px; max-width: 600px;">
      ${pendingItemsByManager[managerEmail]
      .sort((a, b) => new Date(a[10]) - new Date(b[10]))
      .map((employee) => {
        const employeeName = employee[0]; // Assuming 'name' is the property for employee name
        const pendingDays = employee[15]; // Assuming 'pendingDays' is the property for pending days
        const limitDate = employee[10];
        const plannedFirstPeriodStart = employee[16];
        const plannedFirstPeriodEnd = employee[17];

        const plannedSecondPeriodStart = employee[19];
        const plannedSecondPeriodEnd = employee[20]; 
        const hireDate = employee[6];
        const balance = employee[14];
        return `
          <div class="box" style="margin-top: 7px; border: 0.5px solid #67696B; padding: 6px;">
            <div><strong>Name:</strong> ${employeeName}</div>
            <div><strong>Hire Date:</strong> ${hireDate.toString().substring(0, 15)}</div>

            ${plannedFirstPeriodStart || plannedSecondPeriodStart 
              ? `<h3 style="margin-top: 5px; margin-bottom: 3px;">Planned/Taken</h3>` 
              : '<span style="color: red; margin-bottom: -55px;">Not planned yet.</span>'}

            ${plannedFirstPeriodStart !== '' & plannedFirstPeriodEnd !== '' ? 
              `<div style="display: flex; text-align: left;">
                <span style="margin-right: 10px; width: 70px;">1st period </span>
                <div style="${plannedFirstPeriodStart !== '' && new Date(plannedFirstPeriodEnd) >= new Date() ? '' : 'text-decoration: line-through; color: #A9A9A9'}">
                  <strong>From:</strong> ${plannedFirstPeriodStart.toString().substring(0, 15)}
                </div>    
                <div style="margin-left: 30px; ${plannedFirstPeriodStart !== '' && new Date(plannedFirstPeriodEnd) >= new Date() ? '' : 'text-decoration: line-through; color: #A9A9A9'}">
                  <strong>To:</strong> ${plannedFirstPeriodEnd.toString().substring(0, 15)}
                </div>
              </div></br>` 
              : ''}
            
            ${plannedSecondPeriodStart !== '' & plannedSecondPeriodEnd !== '' ?
              `<div style="display: flex;">
                <span style="margin-right: 10px; width: 70px;">2nd period </span>
                <div><strong>From:</strong> ${plannedSecondPeriodStart.toString().substring(0, 15)}</div>
                <div style="margin-left: 30px;"><strong>To:</strong> ${plannedSecondPeriodEnd.toString().substring(0, 15)}</div>
              </div>`
              : ''}
              </br>
            <div style='margin-top: 10px;'><strong>Pending Days:</strong> ${pendingDays}</div>
            <div><strong>Limit date to start:</strong> ${limitDate.toString().substring(0, 15)}</div>
          </div>
        `;
      }).join('\n')}
    </div>
  `;
    //ui.alert(managerEmail); // This alert will show each manager's email before sending the email

    // Send email to the current manager
    try {
      MailApp.sendEmail({
        to: managerEmail,
        cc: 'payroll-br@trustly.com',
        subject: "Pending Vacation Days Report!",
        htmlBody: `
          <html>
          <head>
            <style>
              h1 { color: green; }
            </style>
          </head>
          <body>
            Hi, ${managerName}! <br><br>
            <p>
            Here is the list of your team members in Brazil who qualify for vacation, along with their individual vacation day balances. Furthermore, you’ll find the date they need to utilitze their vacation time to prevent any penalties in accordance with Brazilian labor laws.
            
            <ul>${plannedList}</ul>
            <strong>Pending Days : Days balance that needs to be planned and taken before the Limit Date to Start.</strong>
            <p><strong>Limit date to start: EE must start their vacation period on or before this date; otherwise, a fine will be applied by applicable regulatory body. Please schedule with your team to utilize these days before the limit date to start.</strong></p>
            <p style="margin-bottom: ;10px;">You can access the <a _target="blank" href="https://trustly.atlassian.net/wiki/spaces/FinanceAmericas/pages/70371115018/BR+Vacation+Policy.">Vacation Policy</a> for any reference you may require. In case of any question, feel free to reach out to me. </p>
        

                <p>Best regards!</p>

                <div style='font-size:10pt;font-family:sans-serif;color:#000000;line-height:1.35; width: 600px;'>
                    <div style='font-weight:bold;'>Thais Sallet</div>
                    <div>Payroll Analyst</div>
                    <div>Trustly, Inc.</div>
                    <div>+55 27 99810-3673</div>
                    <div style='margin-top: 10px; display: flex; justify-content: space-between;'>
                        <div style='width: 20px;'>
                            <a href='https://www.linkedin.com/company/trustly/'>
                                <img width='14' height='14' src='https://tinyurl.com/y6ovggcv'>
                            </a>
                        </div>
                        <div style='width: 20px;'>
                            <a href='https://www.facebook.com/trustly'>
                                <img width='14' height='14' src='https://tinyurl.com/y5e8ctjh'>
                            </a>
                        </div>
                        <div style='width: 20px;'>
                            <a href='https://twitter.com/trustly'>
                                <img width='14' height='14' src='https://tinyurl.com/Xtwitterlogo'>
                            </a>
                        </div>
                        <div style='flex-grow: 1;'></div>
                    </div>
                    <div style='margin-top: 10px; display: flex; justify-content: center;'>
                        <div style='margin-top: 10px'>
                            <a href='https://www.trustly.net/'>
                                <img width='96' height='20' src='https://tinyurl.com/Trustlylogo'>
                            </a>
                        </div>
                    </div>
                </div>

          </body>
          </html>
        `,
      });

      // Update status or do other actions if needed
    } catch (error) {
      // Handle errors
    }
  }
}
/*
function createTrigger() {
  var tomorrow = new Date();
  //tomorrow.setDate(tomorrow.getDate()); // Set the date to tomorrow
  var year = tomorrow.getFullYear();
  var month = tomorrow.getMonth();
  var day = tomorrow.getDate();

  ScriptApp.newTrigger("sendMail")
    .timeBased()
    .atDate(year, month, day)
    .atHour(20) // 4 PM (24-hour format)
    .nearMinute(54) // 40 minutes past the hour
    .create();
}*/

function createTrigger() {
  // Create a trigger to run the sendMail function periodically
  ScriptApp.newTrigger("sendMail")
    .timeBased()
    .everyMinutes(1)
    .create();
}

// This function is meant to be run manually by the user
function setupMenu() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu("Submit").addItem("Send pending vacation days", "sendMail").addToUi();
}



<table className="min-w-full border-collapse mb-96">
<thead>
    <tr>
        <th className="border border-gray-300 px-2 py-2 bg-gray-200 text-left">Name</th>
        <th className="border border-gray-300 px-2 py-2 bg-gray-200 text-left">Hire Date</th>
        <th className="border border-gray-300 px-2 py-2 bg-gray-200 text-left">Ref Period</th>
        <th className="border border-gray-300 px-2 py-2 bg-gray-200 text-left">Cash Out</th>
        <th colSpan={2} className="border border-gray-300 px-2 py-2 bg-gray-200 text-left">Planned/Taken</th>
        <th className="border border-gray-300 px-2 py-2 bg-gray-200 text-left">Pending</th>
        <th className="border border-gray-300 px-2 py-2 bg-gray-200 text-left">Limit to Start</th>
    </tr>
</thead>
<tbody>
    <tr>
        <td className="border border-gray-300 px-2 py-2 align-center text-center" rowSpan={3}>Thais</td>
        <td className="border border-gray-300 px-2 py-2 align-center text-center" rowSpan={3}>08-Aug-2022</td>
        <td className="border border-gray-300 px-2 py-2 align-center text-center" rowSpan={3}>2022/2023</td>
        <td className="border border-gray-300 px-2 py-2 align-center text-center" rowSpan={3}>Yes</td>
        <td className="border border-gray-300 px-2 py-2">1st period</td>
        <td className="border border-gray-300 px-2 py-2">2023-03-08</td>
        <td className="border border-gray-300 px-2 py-2 align-center text-center" rowSpan={3}>5</td>
        <td className="border border-gray-300 px-2 py-2 align-center text-center" rowSpan={3}>17-Jul-2024</td>
    </tr>
    <tr>
        <td className="border border-gray-300 px-2 py-2">2nd period</td>
        <td className="border border-gray-300 px-2 py-2">2023-03-08</td>
    </tr>
    <tr>
        <td className="border border-gray-300 px-2 py-2">3rd period</td>
        <td className="border border-gray-300 px-2 py-2">2023-03-08</td>
    </tr>

</tbody>
<tbody>
    <tr>
        <td className="border border-gray-300 px-2 py-2 align-center text-center" rowSpan={3}>Thais</td>
        <td className="border border-gray-300 px-2 py-2 align-center text-center" rowSpan={3}>08-Aug-2022</td>
        <td className="border border-gray-300 px-2 py-2 align-center text-center" rowSpan={3}>2022/2023</td>
        <td className="border border-gray-300 px-2 py-2 align-center text-center" rowSpan={3}>Yes</td>
        <td className="border border-gray-300 px-2 py-2">1st period</td>
        <td className="border border-gray-300 px-2 py-2">2023-03-08</td>
        <td className="border border-gray-300 px-2 py-2 align-center text-center" rowSpan={3}>5</td>
        <td className="border border-gray-300 px-2 py-2 align-center text-center" rowSpan={3}>17-Jul-2024</td>
    </tr>
    <tr>
        <td className="border border-gray-300 px-2 py-2">2nd period</td>
        <td className="border border-gray-300 px-2 py-2">2023-03-08</td>
    </tr>
    <tr>
        <td className="border border-gray-300 px-2 py-2">3rd period</td>
        <td className="border border-gray-300 px-2 py-2">2023-03-08</td>
    </tr>

</tbody>
</table>