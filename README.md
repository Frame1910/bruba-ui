# Bruba UI

# Prerequisites

- Node.js 22.12
- Angular CLI (can be installed via `npm i -g @angular/cli`)

# Getting started

1. Clone the repo using `git clone <...>`
2. Run 
3. In the root of the project, run `npm install`
4. Ensure you have a version of `bruba-api` running on your machine by visiting [its GitHub Repo](https://github.com/Frame1910/bruba-api) and following its instructions in the README
5. Run `ng s` to serve a local version of the UI

# UI Documentation / Notes

## Accept Screen
### Accept Screen Issues
- Step 2 will not render it's label until RSVP
- To avoid binding issues when a user wants to change who is RSVP'd in step 1, step 2 will be set to undefined when stepping back. This removes any data if the user has already filled out any data on step 2.
- I feel like a lot of this can be fixed by using formArrays but I cbf changing it at the moment

### Accept Screen TODO
- Navigate to a sad screen if RSVP is declined by all users on an invite
- Update step 2 with relevant formcontrols and validators
- Call API to save the input data
