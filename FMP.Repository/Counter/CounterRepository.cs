/// <summary>
/// Schlumberger Private
/// Copyright 2018 Schlumberger.All rights reserved in Schlumberger
/// authored and generated code(including the selection and arrangement of
/// the source code base regardless of the authorship of individual files),
/// but not including any copyright interest(s) owned by a third party
/// related to source code or object code authored or generated by
/// non-Schlumberger personnel.
/// This source code includes Schlumberger confidential and/or proprietary
/// information and may include Schlumberger trade secrets.Any use,
/// disclosure and/or reproduction is prohibited unless authorized in
/// writing.
/// </summary>

using FMP.Repository.Counter.Interface;
using FMP.Repository.Interface;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.Linq;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FMP.Repository.Counter
{
    /// <summary>
    /// Counter Repository
    /// </summary>
    public class CounterRepository : ICounterRepository
    {
        /// <summary>
        /// FMP Context
        /// </summary>
        protected IFMPContext _fmpContext;
       
        /// <summary>
        /// Initialize FMP Context
        /// </summary>
        /// <param name="fmpContext"></param>
        public CounterRepository(IFMPContext fmpContext)
        {
            _fmpContext = fmpContext;
        }

        /// <summary>
        /// Returns counter collection.
        /// </summary>
        /// <returns>Counter object</returns>
        public async Task<Model.CounterDataModel.Counter> GetCounter()
        {
            Model.CounterDataModel.Counter counter = await _fmpContext.Counter.Find(_ => true).FirstOrDefaultAsync();
            bool insertRecord = false;
            if (counter == null)
            {
                counter = new FMP.Model.CounterDataModel.Counter();
                counter._id = new ObjectId();
                counter.ID = 1;
                insertRecord = true;
            }
            this.InitFMPRoleCounter(counter);
            this.InitRolePermissionsCounter(counter);
            this.InitCMMSRoleCounter(counter);
            this.InitLayoutCounter(counter);
            if (insertRecord)
            {
                await _fmpContext.Counter.InsertOneAsync(counter);
            }
            return counter;
        }

        #region "Initialze Counter Methods"





        private void InitFMPRoleCounter(Model.CounterDataModel.Counter counter)
        {
            if (counter.RoleCounter < 1)
            {
                List<Model.RoleDataModel.Role> data = _fmpContext.Role.Find(_ => true).ToList();
                counter.RoleCounter = data != null && data.Count > 0 ? data.Max(c => c.ID) + 1 : 1;
            }
        }

        private void InitRolePermissionsCounter(Model.CounterDataModel.Counter counter)
        {
            if (counter.ClaimCounter < 1)
            {
                List<Model.RoleDataModel.Claim> data = _fmpContext.Claim.Find(_ => true).ToList();
                counter.ClaimCounter = data != null && data.Count > 0 ? data.Max(c => c.ID) + 1 : 1;
            }
        }

        private void InitCMMSRoleCounter(Model.CounterDataModel.Counter counter)
        {
            if (counter.CMMSRoleCounter < 1)
            {
                List<Model.RoleDataModel.CMMSRole> data = _fmpContext.CMMSRole.Find(_ => true).ToList();
                counter.CMMSRoleCounter = data != null && data.Count > 0 ? data.Max(c => c.ID) + 1 : 1;
            }
        }


        private void InitLayoutCounter(Model.CounterDataModel.Counter counter)
        {
            if (counter.LayoutCounter < 1)
            {
                List<Model.LayoutDataModel.Layout> data = _fmpContext.Layouts.Find(_ => true).ToList();
                counter.LayoutCounter = data != null && data.Count > 0 ? data.Max(c => c.LayoutID) + 1 : 1;
            }
        }
        #endregion
        
        #region "Get Next Counter Methods"
        /// <summary>
        /// Get the current Scheduler Counter number and do plus one in Scheduler Counter number.
        /// </summary>
        /// <returns>number</returns>
        public async Task<int> GetNextSchedulerID()
        {
            Model.CounterDataModel.Counter counter = await this.GetCounter();
            var filter = Builders<FMP.Model.CounterDataModel.Counter>.Filter.Where(c => c.ID > 0);
            var updatestatement = Builders<FMP.Model.CounterDataModel.Counter>.Update.Set(c => c.SchedulerCounter, counter.SchedulerCounter + 1);
            UpdateResult updateResult = await _fmpContext.Counter.UpdateManyAsync(filter, updatestatement);
            if (updateResult != null && updateResult.IsAcknowledged && updateResult.ModifiedCount > 0)
            {
                return counter.SchedulerCounter;
            }
            else
            {
                return -1;
            }
        }
        /// <summary>
        /// Get the current Classification Counter number and do plus one in Classification Counter number.
        /// </summary>
        /// <returns>number</returns>
        public async Task<int> GetNextClassificationID()
        {
            Model.CounterDataModel.Counter counter = await this.GetCounter();
            var filter = Builders<FMP.Model.CounterDataModel.Counter>.Filter.Where(c => c.ID > 0);
            var updatestatement = Builders<FMP.Model.CounterDataModel.Counter>.Update.Set(c => c.ClassificationCounter, counter.ClassificationCounter + 1);
            UpdateResult updateResult = await _fmpContext.Counter.UpdateManyAsync(filter, updatestatement);
            if (updateResult != null && updateResult.IsAcknowledged && updateResult.ModifiedCount > 0)
            {
                return counter.ClassificationCounter;
            }
            else
            {
                return -1;
            }
        }
        /// <summary>
        /// Get the current Site Counter number and do plus one in Site Counter number.
        /// </summary>
        /// <returns>number</returns>
        public async Task<int> GetNextSiteID()
        {
            Model.CounterDataModel.Counter counter = await this.GetCounter();
            var filter = Builders<FMP.Model.CounterDataModel.Counter>.Filter.Where(c => c.ID > 0);
            var updatestatement = Builders<FMP.Model.CounterDataModel.Counter>.Update.Set(c => c.SiteCounter, counter.SiteCounter + 1);
            UpdateResult updateResult = await _fmpContext.Counter.UpdateManyAsync(filter, updatestatement);
            if (updateResult != null && updateResult.IsAcknowledged && updateResult.ModifiedCount > 0)
            {
                return counter.SiteCounter;
            }
            else
            {
                return -1;
            }
        }

        /// <summary>
        /// Get the current WorkStation Counter number and do plus one in WorkStation Counter number.
        /// </summary>
        /// <returns>number</returns>
        public async Task<int> GetNextWorkStationID()
        {
            Model.CounterDataModel.Counter counter = await this.GetCounter();
            var filter = Builders<FMP.Model.CounterDataModel.Counter>.Filter.Where(c => c.ID > 0);
            var updatestatement = Builders<FMP.Model.CounterDataModel.Counter>.Update.Set(c => c.WorkStationCounter, counter.WorkStationCounter + 1);
            UpdateResult updateResult = await _fmpContext.Counter.UpdateManyAsync(filter, updatestatement);
            if (updateResult != null && updateResult.IsAcknowledged && updateResult.ModifiedCount > 0)
            {
                return counter.WorkStationCounter;
            }
            else
            {
                return -1;
            }
        }

        public async Task<int> GetNextLanguageID()
        {
            Model.CounterDataModel.Counter counter = await this.GetCounter();
            var filter = Builders<FMP.Model.CounterDataModel.Counter>.Filter.Where(c => c.ID > 0);
            var updatestatement = Builders<FMP.Model.CounterDataModel.Counter>.Update.Set(c => c.LanguageCounter, counter.LanguageCounter + 1);
            UpdateResult updateResult = await _fmpContext.Counter.UpdateManyAsync(filter, updatestatement);
            if (updateResult != null && updateResult.IsAcknowledged && updateResult.ModifiedCount > 0)
            {
                return counter.LanguageCounter;
            }
            else
            {
                return -1;
            }
        }

        public async Task<int> GetNextRoleID()
        {
            Model.CounterDataModel.Counter counter = await this.GetCounter();
            var filter = Builders<FMP.Model.CounterDataModel.Counter>.Filter.Where(c => c.ID > 0);
            var updatestatement = Builders<FMP.Model.CounterDataModel.Counter>.Update.Set(c => c.RoleCounter, counter.RoleCounter + 1);
            UpdateResult updateResult = await _fmpContext.Counter.UpdateManyAsync(filter, updatestatement);
            if (updateResult != null && updateResult.IsAcknowledged && updateResult.ModifiedCount > 0)
            {
                return counter.RoleCounter;
            }
            else
            {
                return -1;
            }
        }

        public async Task<int> GetNextClaimID()
        {
            Model.CounterDataModel.Counter counter = await this.GetCounter();
            var filter = Builders<FMP.Model.CounterDataModel.Counter>.Filter.Where(c => c.ID > 0);
            var updatestatement = Builders<FMP.Model.CounterDataModel.Counter>.Update.Set(c => c.ClaimCounter, counter.ClaimCounter + 1);
            UpdateResult updateResult = await _fmpContext.Counter.UpdateManyAsync(filter, updatestatement);
            if (updateResult != null && updateResult.IsAcknowledged && updateResult.ModifiedCount > 0)
            {
                return counter.ClaimCounter;
            }
            else
            {
                return -1;
            }
        }

        public async Task<int> GetNextCMMSRoleID()
        {
            Model.CounterDataModel.Counter counter = await this.GetCounter();
            var filter = Builders<FMP.Model.CounterDataModel.Counter>.Filter.Where(c => c.ID > 0);
            var updatestatement = Builders<FMP.Model.CounterDataModel.Counter>.Update.Set(c => c.CMMSRoleCounter, counter.CMMSRoleCounter + 1);
            UpdateResult updateResult = await _fmpContext.Counter.UpdateManyAsync(filter, updatestatement);
            if (updateResult != null && updateResult.IsAcknowledged && updateResult.ModifiedCount > 0)
            {
                return counter.CMMSRoleCounter;
            }
            else
            {
                return -1;
            }
        }

        public async Task<int> GetNextEquipmentRIMEIndicesID()
        {
            Model.CounterDataModel.Counter counter = await this.GetCounter();
            var filter = Builders<FMP.Model.CounterDataModel.Counter>.Filter.Where(c => c.ID > 0);
            var updatestatement = Builders<FMP.Model.CounterDataModel.Counter>.Update.Set(c => c.EquipmentRIMEIndices, counter.EquipmentRIMEIndices + 1);
            UpdateResult updateResult = await _fmpContext.Counter.UpdateManyAsync(filter, updatestatement);
            if (updateResult != null && updateResult.IsAcknowledged && updateResult.ModifiedCount > 0)
            {
                return counter.EquipmentRIMEIndices;
            }
            else
            {
                return -1;
            }
        }

        public async Task<int> GetNextLayoutID()
        {
            Model.CounterDataModel.Counter counter = await this.GetCounter();
            var filter = Builders<FMP.Model.CounterDataModel.Counter>.Filter.Where(c => c.ID > 0);
            var updatestatement = Builders<FMP.Model.CounterDataModel.Counter>.Update.Set(c => c.LayoutCounter, counter.LayoutCounter + 1);
            UpdateResult updateResult = await _fmpContext.Counter.UpdateManyAsync(filter, updatestatement);
            if (updateResult != null && updateResult.IsAcknowledged && updateResult.ModifiedCount > 0)
            {
                return counter.LayoutCounter;
            }
            else
            {
                return -1;
            }
        }
        #endregion
    }
}
