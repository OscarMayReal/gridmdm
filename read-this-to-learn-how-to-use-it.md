# Read this to learn how to use it

go to grid at https://grid.qplus.cloud, and click log in

log in with the demo user:
- email: admin@quntemtestingsubdomain.dedyn.io
- password: test

try exploring around.

## some things to try

### acquire an app:

- click apps in the main sidebar
- click featured apps in the secondary sidebar
- click on an app to see its details
- click acquire to acquire the app

### Create a policy:

- click policies in the main sidebar
- click create policy at the top of the page
- fill out the policy form
- click create to create the policy

### Add rules to policy:

- click policies in the main sidebar
- click on a policy to see its details
- click Blocks in the secondary sidebar
- add a settings block
- click add setting from library
- select a setting from the library (maybe try the color scheme and accent color from the desktop appearance section)
- click the setting to configure it

### Assign policy to group:

- click policies in the main sidebar
- click on a policy to see its details
- click Assignments in the secondary sidebar
- click create assignment
- select a group from the dropdown
- click create to create the assignment

### Create an app policy:

- click policies in the main sidebar
- click Application Policies in the secondary sidebar
- click create policy at the top of the page
- fill out the policy form
- click create to create the policy

### Add apps to app policy:

- click policies in the main sidebar
- click Application Policies in the secondary sidebar
- click on an app policy to see its details
- click Apps in the secondary sidebar
- click add app to add an app to the policy
- select an app from the dropdown
- click add to add the app to the policy

### Assign app policy to group:

- click policies in the main sidebar
- click Application Policies in the secondary sidebar
- click on an app policy to see its details
- click Assignments in the secondary sidebar
- click create assignment
- select a group from the dropdown
- click create to create the assignment

## How to enroll a device:

### Install VM

- download the ISO from this file share
- use your VM software of choice to install the linux distro
- install and setup the linux distro like normal

### Enroll device:

- open a terminal (ptyxis)
- run `sudo keystonedir-enroll-util`
- enroll using the demo credentials at the top of this file (the password prompt is after the email, and doesnt show the password or prompt)
- name dev device what you want
- enter the number of the group you assigned the policy to
- reboot the VM once you see the confirmation message

## General Tasks

you should see the settings you set take effect (like the accent color and color scheme)

### Install optional apps:

- open grid portal
- click apps in the header
- click on an app to see its details
- click install to install the app
