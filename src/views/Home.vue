<template>
  <div class="home">
    <h1>
      Welcome To BassTracker
    </h1>
    <p>
      Select one of the options below to begin:
    </p>
    <div class="destinations">
      <div v-for="destination in destinations" :key="destination.name">
        <router-link
          :to="{
            name: 'DestinationDetails',
            params: { slug: destination.slug },
          }"
        >
          <h2>{{ destination.name }}</h2>
        </router-link>
        <figure>
          <router-link
            :to="{
              name: 'DestinationDetails',
              params: { slug: destination.slug },
            }"
          >
            <img
              :src="require(`@/assets/${destination.image}`)"
              :alt="destination.name"
            />
          </router-link>
        </figure>
      </div>
    </div>
    <section>
      <h1>Tickets Table</h1>
      <p>Use the Interface Below to Sort</p>
      <template>
        <div>
          <b-button v-b-modal.new-ticket-modal>Create New Ticket</b-button>

          <b-modal
            id="new-ticket-modal"
            size="lg"
            ref="modal"
            title="Create New Ticket"
            @show="resetNewTicketModal"
            @hidden="resetNewTicketModal"
            @ok="handleNewTicketOk"
          >
            <form ref="form" @submit.stop.prevent="handleSubmit">
              <b-form-group
                label="Name"
                label-for="name-input"
                invalid-feedback="Name is required"
                :state="newNameState"
              >
                <b-form-input
                  id="name-input"
                  v-model="newName"
                  :state="newNameState"
                  required
                ></b-form-input>
              </b-form-group>
              <b-form-group
                label="Associated Project"
                label-for="project-input"
                invalid-feedback="Associated Project is required"
                :state="newProjectState"
              >
                <b-form-select
                  v-model="newProject"
                  :options="getNewProjectOptions"
                  :state="newProjectState"
                  required
                ></b-form-select>
              </b-form-group>
              <b-form-group
                label="Description"
                label-for="desc-input"
                invalid-feedback="Description is required"
                :state="newDescState"
              >
                <b-form-input
                  id="desc-input"
                  v-model="newDesc"
                  :state="newDescState"
                  required
                ></b-form-input>
              </b-form-group>
              <b-form-group
                label="Tag Type"
                label-for="tag-input"
                invalid-feedback="Tag Type is required"
                :state="newTagState"
              >
                <b-form-select
                  v-model="newTag"
                  :options="getNewTagOptions"
                  :state="newTagState"
                  required
                ></b-form-select>
              </b-form-group>
            </form>
          </b-modal>
        </div>
        <div>
          <b-modal
            id="edit-ticket-modal"
            size="lg"
            ref="modal"
            title="Edit Ticket"
            @show="resetEditTicketModal"
            @hidden="resetEditTicketModal"
            @ok="handleEditTicketOk"
          >
            <form ref="form" @submit.stop.prevent="handleSubmit">
              <b-form-group
                label="New Name"
                label-for="name-input"
                invalid-feedback="Name is required"
                :state="newNameState"
              >
                <b-form-input
                  id="name-input"
                  v-model="editNewName"
                  :state="editNewNameState"
                  required
                ></b-form-input>
              </b-form-group>
              <b-form-group
                label="New Associated Project"
                label-for="project-input"
                invalid-feedback="Associated Project is required"
                :state="newProjectState"
              >
                <b-form-select
                  v-model="editNewProject"
                  :options="getNewProjectOptions"
                  :state="editNewProjectState"
                  required
                ></b-form-select>
              </b-form-group>
              <b-form-group
                label="New Description"
                label-for="desc-input"
                invalid-feedback="Description is required"
                :state="newDescState"
              >
                <b-form-input
                  id="desc-input"
                  v-model="editNewDesc"
                  :state="editNewDescState"
                  required
                ></b-form-input>
              </b-form-group>
              <b-form-group
                label="New Tag Type"
                label-for="tag-input"
                invalid-feedback="Tag Type is required"
                :state="newTagState"
              >
                <b-form-select
                  v-model="editNewTag"
                  :options="getNewTagOptions"
                  :state="editNewTagState"
                  required
                ></b-form-select>
              </b-form-group>
            </form>
          </b-modal>
        </div>
      </template>
      <template id="table">
        <b-container fluid>
          <!-- User Interface controls -->
          <b-row>
            <b-col lg="6" class="my-1">
              <b-form-group
                label="Sort"
                label-for="sort-by-select"
                label-cols-sm="3"
                label-align-sm="right"
                label-size="sm"
                class="mb-0"
                v-slot="{ ariaDescribedby }"
              >
                <b-input-group size="sm">
                  <b-form-select
                    id="sort-by-select"
                    v-model="sortBy"
                    :options="sortOptions"
                    :aria-describedby="ariaDescribedby"
                    class="w-75"
                  >
                    <template #first>
                      <option value="">-- none --</option>
                    </template>
                  </b-form-select>

                  <b-form-select
                    v-model="sortDesc"
                    :disabled="!sortBy"
                    :aria-describedby="ariaDescribedby"
                    size="sm"
                    class="w-25"
                  >
                    <option :value="false">Asc</option>
                    <option :value="true">Desc</option>
                  </b-form-select>
                </b-input-group>
              </b-form-group>
            </b-col>

            <b-col lg="6" class="my-1">
              <b-form-group
                label="Initial sort"
                label-for="initial-sort-select"
                label-cols-sm="3"
                label-align-sm="right"
                label-size="sm"
                class="mb-0"
              >
                <b-form-select
                  id="initial-sort-select"
                  v-model="sortDirection"
                  :options="['asc', 'desc', 'last']"
                  size="sm"
                ></b-form-select>
              </b-form-group>
            </b-col>

            <b-col lg="6" class="my-1">
              <b-form-group
                label="Filter"
                label-for="filter-input"
                label-cols-sm="3"
                label-align-sm="right"
                label-size="sm"
                class="mb-0"
              >
                <b-input-group size="sm">
                  <b-form-input
                    id="filter-input"
                    v-model="filter"
                    type="search"
                    placeholder="Type to Search"
                  ></b-form-input>

                  <b-input-group-append>
                    <b-button :disabled="!filter" @click="filter = ''"
                      >Clear</b-button
                    >
                  </b-input-group-append>
                </b-input-group>
              </b-form-group>
            </b-col>

            <b-col lg="6" class="my-1">
              <b-form-group
                v-model="sortDirection"
                label="Filter On"
                description="Leave all unchecked to filter on all data"
                label-cols-sm="3"
                label-align-sm="right"
                label-size="sm"
                class="mb-0"
                v-slot="{ ariaDescribedby }"
              >
                <b-form-checkbox-group
                  v-model="filterOn"
                  :aria-describedby="ariaDescribedby"
                  class="mt-1"
                >
                  <b-form-checkbox value="projectName">Project</b-form-checkbox>
                  <b-form-checkbox value="Tag">Tag</b-form-checkbox>
                  <b-form-checkbox value="Timestamp">Timestamp</b-form-checkbox>
                </b-form-checkbox-group>
              </b-form-group>
            </b-col>

            <b-col sm="5" md="6" class="my-1">
              <b-form-group
                label="Per page"
                label-for="per-page-select"
                label-cols-sm="6"
                label-cols-md="4"
                label-cols-lg="3"
                label-align-sm="right"
                label-size="sm"
                class="mb-0"
              >
                <b-form-select
                  id="per-page-select"
                  v-model="perPage"
                  :options="pageOptions"
                  size="sm"
                ></b-form-select>
              </b-form-group>
            </b-col>

            <b-col sm="7" md="6" class="my-1">
              <b-pagination
                v-model="currentPage"
                :total-rows="totalRows"
                :per-page="perPage"
                align="fill"
                size="sm"
                class="my-0"
              ></b-pagination>
            </b-col>
          </b-row>
          <b-table
            :fields="fields"
            :items="items"
            striped
            responsive="sm"
            :current-page="currentPage"
            :per-page="perPage"
            :filter="filter"
            :filter-included-fields="filterOn"
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
            :sort-direction="sortDirection"
            stacked="md"
            show-empty
            hover
            @filtered="onFiltered"
          >
            <template #cell(actions)="row">
              <b-button size="sm" @click="row.toggleDetails" class="mr-2">
                {{ row.detailsShowing ? "Hide" : "Show" }} Details
              </b-button>

              <b-button
                size="sm"
                v-b-modal.edit-ticket-modal
                @click="setForEdit(row.item.ticketId)"
                >Edit Ticket Info</b-button
              >
              <!-- As `row.showDetails` is one-way, we call the toggleDetails function on @change -->
            </template>
            <template #row-details="row">
              <b-card>
                <b-row class="mb-2">
                  <b-col sm="3" class="text-sm-right">
                    <b>Parent Project Name:</b>
                  </b-col>
                  <b-col>
                    {{ row.item.projectName }}
                  </b-col>
                </b-row>
                <b-row class="mb-2">
                  <b-col sm="3" class="text-sm-right">
                    <b>
                      Parent Project ID:
                    </b>
                  </b-col>
                  <b-col>
                    {{ row.item.projectId }}
                  </b-col>
                </b-row>
                <b-row class="mb-2">
                  <b-col sm="3" class="text-sm-right">
                    <b>
                      Ticket ID:
                    </b>
                  </b-col>
                  <b-col>
                    {{ row.item.ticketId }}
                  </b-col>
                </b-row>
                <b-row class="mb-2">
                  <b-col sm="3" class="text-sm-right">
                    <b>
                      Ticket Name
                    </b>
                  </b-col>
                  <b-col>{{ row.item.ticketName }}</b-col>
                </b-row>
                <b-row class="mb-2">
                  <b-col sm="3" class="text-sm-right">
                    <b>
                      Ticket Slug
                    </b>
                  </b-col>
                  <b-col>{{ row.item.ticketSlug }}</b-col>
                </b-row>
                <b-row class="mb-2">
                  <b-col sm="3" class="text-sm-right">
                    <b>
                      Ticket Tag/Label:
                    </b>
                  </b-col>
                  <b-col>
                    {{ row.item.ticketTag }}
                  </b-col>
                </b-row>
                <b-row class="mb-2">
                  <b-col sm="3" class="text-sm-right">
                    <b>
                      Ticket Description
                    </b>
                  </b-col>
                  <b-col>{{ row.item.ticketDescription }}</b-col>
                </b-row>
                <b-row class="mb-2">
                  <b-col sm="3" class="text-sm-right">
                    <b>
                      Timestamp Created/Updated
                    </b>
                  </b-col>
                  <b-col>
                    {{ row.item.time_Stamp }}
                  </b-col>
                </b-row>
                <b-button size="sm" @click="row.toggleDetails">
                  Hide Details
                </b-button>
              </b-card>
            </template>
          </b-table>
        </b-container>
      </template>
    </section>
  </div>
</template>

<script>
// @ is an alias to /src
import store from "@/store.js";
export default {
  name: "Home",
  components: {},
  data() {
    return {
      // Fields/Columns for the Tickets Table
      fields: [
        {
          key: "projectName",
          label: "Project",
          sortable: true,
          sortDirection: "desc",
        },
        "ticketName",
        { key: "ticketTag", label: "Tag", sortable: true, sortDirection: "desc" },
        {
          key: "time_Stamp",
          label: "Timestamp",
          sortable: true,
          sortDirection: "desc",
        },
        "ticketDescription",
        "actions",
      ],
      // Destinations (to be changed in future update(s))
      destinations: store.destinations,
      // The array/list of ticket items displayed in the Tickets Table on the main page
      items: [],
      // The List of Available Projects when creating a new Project
      projectOptions: [],
      
      
      // -> Data used & Updated by/for the Create New Ticket(s) Modal: 

      // Variable used to store the entered new name for a new ticket being created
      newName: "",

      /* Indicator/tracker used to track the current state of its associated variable, newName
      (used mostly for methods for resetting the modals' background variables/information) */
      newNameState: null,

      // Variable used to store the entered new description for a new ticket being created
      newDesc: "",

      /* Indicator/tracker used to track the current state of its associated variable, newDesc
      (used mostly for methods for resetting the modals' background variables/information) */
      newDescState: null,

      // Variable used to store the entered new tag for a new ticket being created
      newTag: "",

      /* Indicator/tracker used to track the current state of its associated variable, newTag
      (used mostly for methods for resetting the modals' background variables/information) */
      newTagState: null,

      /* Indicator/tracker used to track the current state of its associated variable, the new Project's Id
      (used mostly for methods for resetting the modals' background variables/information) */
      newProjectIdState: null,

      // Variable used to store the entered new project name for a new ticket being created
      newProject: "",

      /* Indicator/tracker used to track the current state of its associated variable, newProject
      (used mostly for methods for resetting the modals' background variables/information) */
      newProjectState: null,

      // -> Data used & Updated by/for the Edit New Ticket(s) Modal

      // The variable used to store the id of the ticket that's currently being edited by the user
      idOfTicketToEdit: "",

      // Variable used to store the entered new name for a ticket being edited
      editNewName: "",

      /* Indicator/tracker used to track the current state of its associated variable, editNewName
      (used mostly for methods for resetting the modals' background variables/information) */
      editNewNameState: null,

      // Variable used to store the entered new description for a ticket being edited
      editNewDesc: "",

      /* Indicator/tracker used to track the current state of its associated variable, editNewDesc
      (used mostly for methods for resetting the modals' background variables/information) */
      editNewDescState: null,

      // Variable used to store the entered new tag for a ticket being edited
      editNewTag: "",

      /* Indicator/tracker used to track the current state of its associated variable, editNewTag
      (used mostly for methods for resetting the modals' background variables/information) */
      editNewTagState: null,

      /* Indicator/tracker used to track the current state of its associated variable, the new Project Id being assigned
      (used mostly for methods for resetting the modals' background variables/information) */
      editNewProjectIdState: null,

      // Variable used to store the entered new project name for a ticket being edited
      editNewProject: "",

      /* Indicator/tracker used to track the current state of its associated variable, editNewProject
      (used mostly for methods for resetting the modals' background variables/information) */
      editNewProjectState: null,

      // -> Data used & Updated by/for the table filtering interface
      totalRows: 1,
      currentPage: 1,
      perPage: 5,
      pageOptions: [5, 10, 15, { value: 100, text: "Show a lot" }],
      sortBy: "",
      sortDesc: false,
      sortDirection: "asc",
      filter: null,
      filterOn: [],
    };
  },
  created: function() {
    // Ensures that the required data for the table is acquired on page creation
    this.getTicketData("http://localhost:5000/api/v1/ticket/");
    this.getProjectsData("http://localhost:5000/api/v1/project/");
  },
  computed: {
    sortOptions() {
      // Create an options list from our fields
      return this.fields
        .filter((f) => f.sortable)
        .map((f) => {
          return { text: f.label, value: f.key };
        });
    },
    tagTypes() {
      // Return the different available tag categories to for choosing from the store.js
      return store.tagTypes;
    },
    getNewTagOptions() {
      // Creates and returns a list for modals to display the available tag types for users to use while editing or creating new tickets
      let finalTagList = [];
      let i;
      let tagsLen = this.tagTypes.length;
      for (i = 0; i < tagsLen; i++) {
        let curTag = this.tagTypes[i];
        let curDict = {
          value: curTag,
          text: curTag,
        };
        finalTagList.push(curDict);
      }
      return finalTagList;
    },
    getNewProjectOptions() {
      // Creates and returns a list for modals to display the available projects for users to assign tickets to while editing or creating them.
      let finalProjectList = [];
      let i;
      let projectsLen = this.projectOptions.length;
      for (i = 0; i < projectsLen; i++) {
        let curTag = this.projectOptions[i].name;
        let curId = this.projectOptions[i].projectId;
        let curDict = {
          value: { name: curTag, id: curId },
          text: curTag,
        };
        finalProjectList.push(curDict);
      }
      return finalProjectList;
    },
  },
  mounted() {
    this.setTotalRows();
    //this.totalRows = this.items.length;
  },
  methods: {
    async getTicketData(url = "") {
      // All Tickets GET method implementation:

      // Default options are marked with *
      try {
        const response = await fetch(url, {
          method: "GET", // *GET, POST, PUT, DELETE, etc.
          mode: "cors", // no-cors, *cors, same-origin
          cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
          credentials: "same-origin", // include, *same-origin, omit
          headers: {
            "Content-Type": "application/json",
          },
          redirect: "follow", // manual, *follow, error
          referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        });
        let theJson = await response.json();
        this.items = theJson;
        return theJson; // parses JSON response into native JavaScript objects
      } catch (e) {
        alert("Error with request");
        console.log(e);
      }
    },
    async getProjectsData(url = "") {
      // All Projects GET method implementation:

      // Default options are marked with *
      try {
        const response = await fetch(url, {
          method: "GET", // *GET, POST, PUT, DELETE, etc.
          mode: "cors", // no-cors, *cors, same-origin
          cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
          credentials: "same-origin", // include, *same-origin, omit
          headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          redirect: "follow", // manual, *follow, error
          referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        });
        let theJson = await response.json();
        this.projectOptions = theJson;
        return theJson; // parses JSON response into native JavaScript objects
      } catch (e) {
        alert("Error with request");
        console.log(e);
      }
    },
    async postTicketsData(url = "", data = {}) {
      // New Ticket POST method implementation:

      // Default options are marked with *
      try {
        const response = await fetch(url, {
          method: "POST", // *GET, POST, PUT, DELETE, etc.
          mode: "cors", // no-cors, *cors, same-origin
          cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
          credentials: "same-origin", // include, *same-origin, omit
          headers: {
            "Content-Type": "application/json",
          },
          redirect: "follow", // manual, *follow, error
          referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
          body: JSON.stringify(data), // body data type must match "Content-Type" header
        });
        return response; // parses JSON response into native JavaScript objects
      } catch (e) {
        alert("Error with request");
        console.log(e);
      }
    },
    async updateTicketsData(url = "", data = {}) {
      // New Ticket PUT method implementation:

      // Default options are marked with *
      try {
        const response = await fetch(url, {
          method: "PUT", // *GET, POST, PUT, DELETE, etc.
          mode: "cors", // no-cors, *cors, same-origin
          cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
          credentials: "same-origin", // include, *same-origin, omit
          headers: {
            "Content-Type": "application/json",
          },
          redirect: "follow", // manual, *follow, error
          referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
          body: JSON.stringify(data), // body data type must match "Content-Type" header
        });
        this.getTicketData("http://localhost:5000/api/v1/ticket/");
        return response; // parses JSON response into native JavaScript objects
      } catch (e) {
        alert("Error with request");
        console.log(e);
      }
    },
    setForEdit(data) {
      // Method that gets necessary data about the row/ticket that is about to have its information edited.
      this.idOfTicketToEdit = data;
      let i;
      let ticketsLen = this.items.length;
      for (i = 0; i < ticketsLen; i++) {
        let curTicket = this.items[i];
        if (curTicket.TicketId === this.idOfTicketToEdit) {
          this.editNewName = curTicket.TicketName;
          this.editNewDesc = curTicket.TicketDescription;
          break;
        }
      }
    },
    setTotalRows() {
      // Sets the total amount of rows for the table based on how many items there are in its data.
      this.totalRows = this.items.length;
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    checkNewTicketFormValidity() {
      // Checks whether all required fields are filled out in the New Ticket Modal and returns valid or not.
      const valid = this.$refs.form.checkValidity();
      this.newNameState = valid;
      this.newDescState = valid;
      this.newTagState = valid;
      return valid;
    },
    checkEditTicketFormValidity() {
      // Checks whether all required fields are filled out in the Edit Ticket Modal and returns valid or not.
      const valid = this.$refs.form.checkValidity();
      this.editNewNameState = valid;
      this.editNewDescState = valid;
      this.editNewTagState = valid;
      return valid;
    },
    resetNewTicketModal() {
      // Resets all of the behind-the-scenes stored form data for the New Ticket Modal to blank 
      this.newName = "";
      this.newNameState = null;
      this.newDesc = "";
      this.newDescState = null;
      this.newTag = "";
      this.newTagState = null;
    },
    resetEditTicketModal() {
      // Resets all of the behind-the-scenes stored form data for the Edit Ticket Modal to blank 
      this.editNewName = "";
      this.editNewNameState = null;
      this.editNewDesc = "";
      this.editNewDescState = null;
      this.editNewTag = "";
      this.editNewTagState = null;
    },
    handleNewTicketOk(bvModalEvt) {
      // Prevent new ticket modal from closing
      bvModalEvt.preventDefault();
      // Trigger submit handler
      this.handleNewTicketSubmit();
    },
    handleEditTicketOk(bvModalEvt) {
      // Prevent edit ticket modal from closing
      bvModalEvt.preventDefault();
      // Trigger submit handler
      this.handleEditTicketSubmit();
    },
    getCurrentTimestamp(){
      // Returns the timestamp of the current date and exact time of day down to seconds, based on your local time zone
      let curYear = new Date().getFullYear();
      let curMonth = new Date().getMonth();
      let curDay = new Date().getDay();
      let curHour = new Date().getHours();
      let curMins = new Date().getMinutes();
      let curSecs = new Date().getSeconds();
      let dateStr =
        curMonth +
        "/" +
        curDay +
        "/" +
        curYear +
        "\n" +
        curHour +
        ":" +
        curMins +
        ":" +
        curSecs;
      return dateStr
    },
    handleNewTicketSubmit() {
      // Handles what happens when the New Ticket Modal receives a submission
      // Exit when the form isn't valid
      if (!this.checkNewTicketFormValidity()) {
        return;
      }
      let itemsLength = this.items.length;
      let dateStr = this.getCurrentTimestamp();
      let newDict = {
        ticketId: itemsLength + 1,
        projectName: this.newProject.name,
        ticketTag: this.newTag,
        ticketDescription: this.newDesc,
        ticketName: this.newName,
        time_Stamp: dateStr,
        projectId: this.newProject.id,
        ticketSlug: this.newName.toLowerCase(),
      };
      //Push the name to submitted names & refresh the table items
      this.postTicketsData("http://localhost:5000/api/v1/ticket/", newDict);
      //Hide the modal manually
      this.$nextTick(() => {
        this.$bvModal.hide("new-ticket-modal");
      });
    },
    findProjectName(givenId) {
      // Returns the name of a project given its id
      let i;
      let projectLen = this.projects.length;
      for (i = 0; i < projectLen; i++) {
        let curProject = this.projects[i];
        if (curProject.id === givenId) {
          return curProject.name;
        }
      }
    },
    handleEditTicketSubmit() {
      // Handles what happens when the Edit Ticket Modal receives a submission
      // Exit when the form isn't valid
      if (!this.checkEditTicketFormValidity()) {
        return;
      }
      let dateStr = this.getCurrentTimestamp();
      let newDict = {
        ticketId: this.idOfTicketToEdit,
        projectName: this.editNewProject.name,
        ticketTag: this.editNewTag,
        ticketDescription: this.editNewDesc,
        ticketName: this.editNewName,
        time_Stamp: dateStr,
        projectId: this.editNewProject.id,
        ticketSlug: this.editNewName.toLowerCase(),
      };
      //Push the name to submitted names
      this.updateTicketsData(`http://localhost:5000/api/v1/ticket/${this.idOfTicketToEdit}`, newDict);
      this.getTicketData("http://localhost:5000/api/v1/ticket/");
      this.idOfTicketToEdit = "";
      //Hide the modal manually
      this.$nextTick(() => {
        this.$bvModal.hide("edit-ticket-modal");
      });
    },
  },
};
</script>
<style scoped>
.home {
  max-width: 1400px;
  margin: 0 auto;
}
img {
  max-width: 200px;
}
.destinations {
  display: flex;
  justify-content: space-between;
}
a {
  color: lightseagreen;
  text-decoration: none;
}
a:hover,
a:visited {
  text-decoration: underline;
}
h1 {
  padding: 10px;
}
</style>
