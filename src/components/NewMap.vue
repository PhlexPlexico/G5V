<template>
  <v-container class="maplist" fluid>
    <v-item-group v-model="Selected" multiple>
      <v-row>
        <v-col
          v-for="mapInfo in MapList"
          :key="mapInfo.id"
          cols="12"
          sm="12"
          md="12"
          lg="3"
        >
          <div class="justify-space-between">
            <v-card dense elevation="3" min-height="">
              <v-card-title> {{ mapInfo.map_display_name }} </v-card-title>
              <v-card-subtitle
                >{{ mapInfo.map_name }}
                <v-checkbox
                  v-model="mapInfo.enabled"
                  :label="$t('User.MapEnabled')"
                  readonly
                  disabled
                />
              </v-card-subtitle>
              <v-card-actions class="pt-0">
                <v-btn
                  class="ml-2 mt-3"
                  fab
                  icon
                  height="40px"
                  right
                  width="40px"
                  @click="
                    selectedMap = mapInfo;
                    deleteDialog = true;
                  "
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
                <v-btn
                  class="ml-2 mt-3"
                  fab
                  icon
                  height="40px"
                  left
                  width="40px"
                  @click="mapInfo.reveal = true"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </v-card-actions>
              <v-expand-transition>
                <v-card
                  v-if="mapInfo.reveal"
                  class="transition-fast-in-fast-out v-card--reveal pt-0"
                >
                  <v-card-title>
                    {{ $t("User.MapEdit") }}
                  </v-card-title>
                  <v-card-subtitle>
                    <v-text-field
                      v-model="mapInfo.map_display_name"
                      :label="$t('User.MapDisplayName')"
                      dense
                    />
                    <v-text-field
                      v-model="mapInfo.map_name"
                      :label="$t('User.MapName')"
                      dense
                    />
                    <v-checkbox
                      v-model="mapInfo.enabled"
                      :label="$t('User.MapEnabled')"
                      dense
                    />
                  </v-card-subtitle>
                  <v-card-actions class="pt-0">
                    <v-btn
                      text
                      color="teal accent-4"
                      @click="
                        UpdateMapInfo(mapInfo);
                        mapInfo.reveal = false;
                      "
                    >
                      {{ $t("User.MapSave") }}
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-expand-transition>
            </v-card>
          </div>
        </v-col>
      </v-row>
    </v-item-group>
    <v-dialog v-model="deleteDialog">
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="darken-1" text @click="deleteDialog = false">
          {{ $t("misc.Cancel") }}
        </v-btn>
        <v-btn color="primary" text @click="deleteDialog = false">
          {{ $t("misc.Save") }}
        </v-btn>
      </v-card-actions>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  props: {
    user: Object
  },
  data() {
    return {
      MapList: [],
      Selected: [],
      deleteDialog: false,
      selectedMap: null
    };
  },
  created() {
    this.GetMapInfo();
  },
  methods: {
    async GetMapInfo() {
      try {
        let res = await this.GetUserMapList(this.user.id);
        if (typeof res == "string") res = [];
        else {
          res.forEach(mapInfo => {
            mapInfo.reveal = false;
            this.MapList.push(mapInfo);
          });
        }
      } catch (error) {
        console.log(error);
      }
      return;
    },
    async UpdateMapInfo(mapInfo) {
      try {
        let updateMapData = [
          {
            id: mapInfo.id,
            map_name: mapInfo.map_name,
            map_display_name: mapInfo.map_display_name,
            enabled: mapInfo.enabled
          }
        ];
        await this.UpdateUserMap(updateMapData);
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>

<style>
.v-card--reveal {
  bottom: 0;
  opacity: 1 !important;
  position: absolute;
  width: 100%;
}
</style>
