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
                  <b-form-checkbox value="Project">Project</b-form-checkbox>
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
                @click="setForEdit(row.item.TicketId)"
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
                    {{ row.item.Project }}
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
                  <b-col>{{ row.item.TicketName }}</b-col>
                </b-row>
                <b-row class="mb-2">
                  <b-col sm="3" class="text-sm-right">
                    <b>
                      Ticket Slug
                    </b>
                  </b-col>
                  <b-col>{{ row.item.slug }}</b-col>
                </b-row>
                <b-row class="mb-2">
                  <b-col sm="3" class="text-sm-right">
                    <b>
                      Ticket Tag/Label:
                    </b>
                  </b-col>
                  <b-col>
                    {{ row.item.Tag }}
                  </b-col>
                </b-row>
                <b-row class="mb-2">
                  <b-col sm="3" class="text-sm-right">
                    <b>
                      Ticket Description
                    </b>
                  </b-col>
                  <b-col>{{ row.item.TicketDescription }}</b-col>
                </b-row>
                <b-row class="mb-2">
                  <b-col sm="3" class="text-sm-right">
                    <b>
                      Timestamp Created/Updated
                    </b>
                  </b-col>
                  <b-col>
                    {{ row.item.Timestamp }}
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
      fields: [
        {
          key: "Project",
          label: "Project",
          sortable: true,
          sortDirection: "desc",
        },
        "TicketName",
        { key: "Tag", label: "Tag", sortable: true, sortDirection: "desc" },
        {
          key: "Timestamp",
          label: "Timestamp",
          sortable: true,
          sortDirection: "desc",
        },
        "TicketDescription",
        "actions",
      ],
      destinations: store.destinations,
      // The ticket items
      items: [],
      // The List of Available Projects when creating a new Project
      projectOptions: [],
      // -> Data used & Updated by/for the Create New Ticket(s) Modal
      sortedBy: "",
      newName: "",
      newNameState: null,
      newDesc: "",
      newDescState: null,
      newTag: "",
      newTagState: null,
      newProjectIdState: null,
      newProject: "",
      newProjectState: null,

      // -> Data used & Updated by/for the Edit New Ticket(s) Modal
      idOfTicketToEdit: "",
      editSortedBy: "",
      editNewName: "",
      editNewNameState: null,
      editNewDesc: "",
      editNewDescState: null,
      editNewTag: "",
      editNewTagState: null,
      editNewProjectIdState: null,
      editNewProject: "",
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
      return store.tagTypes;
    },
    getNewTagOptions() {
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
      //console.log(finalTagList);
      return finalTagList;
    },
    getNewProjectOptions() {
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
      //console.log(finalProjectList);
      return finalProjectList;
    },
  },
  mounted() {
    this.setTotalRows();
    //this.totalRows = this.items.length;
  },
  methods: {
    // All Tickets GET method implementation:
    async getTicketData(url = "") {
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
          //body: JSON.stringify(data) // body data type must match "Content-Type" header
        });
        //console.log(response)
        let theJson = await response.json();
        //console.log(this.items);
        this.items = theJson;
        //console.log(this.items);
        return theJson; // parses JSON response into native JavaScript objects
      } catch (e) {
        alert("Error with request");
        console.log(e);
      }
    },
    // All Projects GET method implementation:
    async getProjectsData(url = "") {
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
          //body: JSON.stringify(data) // body data type must match "Content-Type" header
        });
        //console.log(response)
        let theJson = await response.json();
        //console.log(theJson)
        //console.log(this.items);
        this.projectOptions = theJson;
        //console.log(this.items);
        return theJson; // parses JSON response into native JavaScript objects
      } catch (e) {
        alert("Error with request");
        console.log(e);
      }
    },
    // New Ticket POST method implementation:
    async postTicketsData(url = "", data = {}) {
      // Default options are marked with *
      try {
        console.log(JSON.stringify(data));
        const response = await fetch(url, {
          method: "POST", // *GET, POST, PUT, DELETE, etc.
          mode: "cors", // no-cors, *cors, same-origin
          cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
          credentials: "same-origin", // include, *same-origin, omit
          headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
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
    // New Ticket POST method implementation:
    async updateTicketsData(url = "", data = {}) {
      // Default options are marked with *
      try {
        console.log(JSON.stringify(data));
        const response = await fetch(url, {
          method: "PUT", // *GET, POST, PUT, DELETE, etc.
          mode: "cors", // no-cors, *cors, same-origin
          cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
          credentials: "same-origin", // include, *same-origin, omit
          headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
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
    setForEdit(data) {
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
      //console.log(this.editNewName);
      //console.log(this.editNewDesc);
    },
    setTotalRows() {
      this.totalRows = this.items.length;
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    checkNewTicketFormValidity() {
      const valid = this.$refs.form.checkValidity();
      this.newNameState = valid;
      this.newDescState = valid;
      this.newTagState = valid;
      return valid;
    },
    checkEditTicketFormValidity() {
      const valid = this.$refs.form.checkValidity();
      this.editNewNameState = valid;
      this.editNewDescState = valid;
      this.editNewTagState = valid;
      return valid;
    },
    resetNewTicketModal() {
      this.newName = "";
      this.newNameState = null;
      this.newDesc = "";
      this.newDescState = null;
      this.newTag = "";
      this.newTagState = null;
    },
    resetEditTicketModal() {
      this.idOfTicketToEdit = "";
      this.editNewName = "";
      this.editNewNameState = null;
      this.editNewDesc = "";
      this.editNewDescState = null;
      this.editNewTag = "";
      this.editNewTagState = null;
    },
    handleNewTicketOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();
      // Trigger submit handler
      this.handleNewTicketSubmit();
    },
    handleEditTicketOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();
      // Trigger submit handler
      this.handleEditTicketSubmit();
    },
    getCurrentTimestamp(){
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
      // Exit when the form isn't valid
      if (!this.checkNewTicketFormValidity()) {
        return;
      }
      let itemsLength = this.items.length;
      let dateStr = this.getCurrentTimestamp();
      console.log(this.newProject);
      let newDict = {
        ticketId: itemsLength + 1,
        Project: this.newProject.name,
        Tag: this.newTag,
        TicketDescription: this.newDesc,
        TicketName: this.newName,
        Timestamp: dateStr,
        projectId: this.newProject.id,
        slug: this.newName.toLowerCase(),
      };
      console.log(newDict);
      //Push the name to submitted names
      this.postTicketsData("http://localhost:5000/api/v1/ticket/", newDict);
      this.getTicketData("http://localhost:5000/api/v1/ticket/");
      //Hide the modal manually
      this.$nextTick(() => {
        this.$bvModal.hide("new-ticket-modal");
      });
    },
    findProjectName(givenId) {
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
      // Exit when the form isn't valid
      if (!this.checkEditTicketFormValidity()) {
        return;
      }
            let itemsLength = this.items.length;
      let dateStr = this.getCurrentTimestamp();
      console.log(this.newProject);
      let newDict = {
        ticketId: itemsLength + 1,
        Project: this.newProject.name,
        Tag: this.newTag,
        TicketDescription: this.newDesc,
        TicketName: this.newName,
        Timestamp: dateStr,
        projectId: this.newProject.id,
        slug: this.newName.toLowerCase(),
      };
      console.log(newDict);
      //Push the name to submitted names
      this.updateTicketsData("http://localhost:5000/api/v1/ticket/", newDict);
      this.getTicketData("http://localhost:5000/api/v1/ticket/");
      //Hide the modal manually
      this.$nextTick(() => {
        this.$bvModal.hide("new-ticket-modal");
      });
      //console.log("handlesubmit");
      //console.log(this.idOfTicketToEdit)
      // let i;
      // let ticketsLen = this.theItems.length;
      // console.log(ticketsLen);
      // for (i = 0; i < ticketsLen; i++) {
      //   let curTicket = this.theItems[i];
      //   console.log(curTicket.TicketId);
      //   console.log(this.idOfTicketToEdit);
      //   //console.log(curTicket.TicketId)
      //   //console.log(this.curTicket.TicketId)
      //   if (curTicket.TicketId === this.idOfTicketToEdit) {
      //     console.log("made it");
      //     curTicket.TicketName = this.editNewName;
      //     curTicket.slug = this.editNewName.toLowerCase;
      //     curTicket.TicketDescription = this.editNewDesc;
      //     curTicket.ProjectId = this.editNewProject.id;
      //     curTicket.Project = this.editNewProject.name;
      //     curTicket.Tag = this.editNewTag;
      //     console.log(curTicket);
      //     break;
      //   }
      // }
      // //Hide the modal manually
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
