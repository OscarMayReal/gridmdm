# Read this to learn how to use it

Go to Grid at https://grid.qplus.cloud, and click log in.

Log in with your account credentials.

Try exploring around.

## Some things to try

### Acquire an app

- Click Apps in the main sidebar
- Click Featured Apps in the secondary sidebar
- Click on an app to see its details
- Click Acquire to acquire the app

### Create a configuration

- Click Configurations in the main sidebar
- Click Create Configuration
- Fill out the configuration form
- Pick a configuration type
- Click Create

For device settings, use a DCONF configuration and edit the settings as needed. For app availability, use an Allowed Apps configuration and add apps to it.

### Create a profile

- Click Profiles in the main sidebar
- Click Create Profile
- Fill out the profile form
- Click Create

### Add configurations to a profile

- Click Profiles in the main sidebar
- Click on a profile to see its details
- Click Configurations in the secondary sidebar
- Click Add Configuration
- Select a configuration from the dropdown
- Click Add

### Assign a profile

- Click Profiles in the main sidebar
- Click on a profile to see its details
- Click Assignments in the secondary sidebar
- For user enrollment, click Assign User and select a KeyStone user
- For admin enrollment, click Assign Device and select a device

Only one profile can apply to a device. User-enrolled devices resolve their profile from the assigned user. Admin-enrolled devices use their direct device assignment.

## How to enroll a device

### Install VM

- Download the ISO from this file share
- Use your VM software of choice to install the Linux distro
- Install and set up the Linux distro like normal

### Enroll device

- Open a terminal (ptyxis)
- Run `sudo keystonedir-enroll-util`
- Enroll using the demo credentials at the top of this file
- Name the device what you want
- Reboot the VM once you see the confirmation message

## General Tasks

You should see the configurations in the assigned profile take effect.

### Install optional apps

- Open Grid Portal
- Click Apps in the header
- Click on an optional app from the assigned Allowed Apps configuration
- Click Install
