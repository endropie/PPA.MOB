<template>
  <q-page padding class=" items-stretch content-stretch">
    <q-table
      grid
      :data="TABLE.data"
      :columns="TABLE.columns"
      :pagination.sync="TABLE.pagination"
      :loading="TABLE.loading"
      @request="request"
      :dark="$q.dark.isActive"
      virtual-scroll
      rows-per-page-label="Limit"
      title="Opanme Voucher INDEX"
      style="height:100vh; max-height: calc( 100vh - 80px)"
      class="my-sticky-virtscroll-table pagination-fixed-bottom table-top-no-padding"
    >
      <template v-slot:top>
        <div class="fit q-mx-xs q-pa-sm shadow-2 rounded-borders">
          <q-select ref="searcheable" dense filled
            multiple use-input use-chips
            v-model="TABLE.search.model"
            :options="TABLE.search.options"
            options-dense
            hide-dropdown-icon
            input-debounce="0"
            @filter="TABLE.searchFn"
            @input="TABLE.searchSelected"
          >
            <template  v-slot:after>
              <q-btn class="text-weight-bold fit" color="primary" size="sm" icon="search" @click="TABLE.submitSearch()" />
            </template>
            <template v-slot:selected-item="scope">
              <q-chip
                square
                removable
                dense
                @remove="scope.removeAtIndex(scope.index)"
                :tabindex="scope.tabindex"
                class="q-my-none q-ml-none"
              >
                <q-chip dense square color="blue-grey" text-color="white"
                  class="text-weight-medium text-caption q-ma-none position-relative"
                  style="left:-5px"
                  :label="scope.opt.avatar || scope.opt.name"
                  v-if="!scope.opt.noAvatar"
                />
                {{ scope.opt.label }}
              </q-chip>
            </template>
            <div slot="before-options" class="q-px-md text-caption text-grey text-right">Column search of Table</div>
            <template  v-slot:option="scope">
               <q-item
                  v-bind="scope.itemProps"
                  v-on="scope.itemEvents"
                >
                  <q-item-section>
                    <q-item-label >
                      <q-badge class="text-weight-medium on-left">{{scope.opt.name}}</q-badge>
                      <!-- <q-icon name="chevron_right" /> -->
                      <span class="text-caption">{{scope.opt.label}}</span>
                      <!-- <code>{{scope}}</code> -->
                    </q-item-label>
                    <!-- <q-item-label caption>xxx{{ scope.opt.description }}</q-item-label> -->
                  </q-item-section>
                </q-item>
            </template>
            <template v-slot:after-options>
              <q-separator />
              <!-- <div class="q-px-md text-grey">Others filter</div> -->
              <div class="row q-gutter-sm q-ma-sm">
                <q-btn class="col" no-wrap color="primary" label="STO"
                  :icon-right="TABLE.filterable.trashed.value ? 'visibility_off' : 'visibility'"
                  @click="TABLE.filterable.trashed.value = !TABLE.filterable.trashed.value"
                />
                <q-btn class="col" no-wrap color="primary" label="Trashed"
                  :icon-right="TABLE.filterable.opname.value ? 'visibility_off' : 'visibility'"
                  @click="TABLE.filterable.opname.value = !TABLE.filterable.opname.value"
                />
              </div>
            </template>
          </q-select>
        </div>
      </template>
      <template v-slot:item="rs">
        <div
          class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
          :style="rs.selected ? 'transform: scale(0.95);' : ''"
        >
          <q-card :class="rs.selected ? 'bg-grey-2' : ''" class="cursor-pointer" @click="$router.push(`${TABLE.resource.uri}/${rs.row.id}`)">
            <q-list>
              <q-item style="min-height:auto">
                <q-item-section>
                  <q-item-label ># {{ rs.row.number }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label>
                    <q-badge color="blue-10">{{ rs.row.status }}</q-badge>
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item class="q-pt-none">
                <q-item-section class="text-no-wrap">
                  <q-item-label class="ellipsis" >{{ rs.row.item.part_name }}</q-item-label>
                  <q-item-label class="ellipsis" caption>
                    [{{ rs.row.item.customer_code }}]
                    <span v-if="rs.row.item.part_number">
                      No. {{ rs.row.item.part_number }}
                    </span>
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item style="min-height:auto">
                <q-item-section>
                  <q-item-label >
                    Unit:
                    {{ rs.row.quantity }}
                    {{ rs.row.unit.code }}
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label>
                    <q-badge>{{ rs.row.stockist }}</q-badge>
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item dense>
                <q-item-section>
                  <q-item-label> </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label v-if="rs.row.user_by">By: {{ rs.row.user_by.name }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>
      </template>
    </q-table>
    <q-inner-loading :showing="TABLE.loading">
      <q-spinner size="3em" color="primary" />
    </q-inner-loading>
    <q-page-sticky position="bottom-left" :offset="[25, 25]">
      <q-btn dense glossy fab icon="add" color="positive" :to="`${TABLE.resource.uri}/create`" />
    </q-page-sticky>
  </q-page>
</template>

<script>
import TableMix from '@/mixins/TableMix'
export default {
  name: 'OpnameVoucherIndex',
  mixins: [ TableMix ],
  data: () => ({
    TABLE: {
      loading: false,
      resource: {
        uri: '/admin/warehouses/opname-vouchers',
        api: '/api/warehouses/opname-vouchers',
        includes: ['item','unit','user_by'],
        fields: ['*,status']
      },
      data: [],
      columns: [
        { name:'id', field:'id', hide: true},
        { name:'number', label:'#', field:'number', align:'left' },
        { name:'item', label:'Part', field: (v) => v.item.part_name, align:'left'},
        { name:'quantity', label:'Qty', field:'quantity' },
        { name:'unit', label:'unit', field: (v) => v.unit.code, align:'left' },
        { name:'stockist', label:'Stockist', field:'stockist', align:'center' },
      ],
      searcheable: {
        item: {
          name: 'Part',
          value: null,
        },
      },
      filterable: {
        trashed: {
          value: null,
          get() {
            console.warn('trashed.get', this)
          }
        },
        opname: {
          value: null,
          get() {
            console.warn('trashed.get', this)
          }
        }
      },
      pagination: {
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0,
        sortBy: null,
        descending: false,
      }
    }
  }),
}
</script>
